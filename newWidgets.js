 require(['jquery', 'baja!'], function($, baja) {
   
   $.getScript('/module/sbidcnew/rc/Public/seatchart/jquery.seat-charts.js')
      .done(function() {
        console.log('SeatCharts loaded:', typeof $.fn.seatCharts);
            const VIEW_MODES = {
        TEMPERATURE: 'tempStatusLink',
        POWER: 'powerStatusLink'
    };

    // Debug utility
    window.debugSeatChart = function() {
        if (!window.sc) {
            console.error('No seat chart initialized');
            return;
        }
        
        console.group('Seat Chart Debug Info');
        console.log('All seat IDs:', Object.keys(window.sc.seats));
        console.log('Current selections:', window.sc.find('selected').map(s => s.settings.id));
        console.groupEnd();
    };

    // // Enhanced data parsing
    // function parseObixValue(rawValue) {
    //     if (rawValue === null || rawValue === undefined) return null;
        
    //     if (typeof rawValue === 'boolean') return rawValue;
        
    //     if (typeof rawValue === 'string') {
    //         const numMatch = rawValue.match(/[-+]?\d*\.?\d+/);
    //         if (numMatch) return parseFloat(numMatch[0]);
            
    //         if (rawValue.toLowerCase() === 'true') return true;
    //         if (rawValue.toLowerCase() === 'false') return false;
            
    //         return null;
    //     }
        
    //     if (typeof rawValue === 'number') return rawValue;
        
    //     return null;
    // }
    

     const DataService = (function() {
    const sub = new baja.Subscriber();
    let rackData = [];
    let serverHallsData = [];

    // Main data fetching function
    async function getRackData() {
      try {
        console.log('Starting rack data collection...');
        const { paths, serverHalls } = await fetchOrdPaths();
        
        if (paths.length > 0) {
          console.log(`Found ${paths.length} rack paths via ORD navigation`);
          const processedData = await processOrdPaths(paths, serverHalls);
          
          if (processedData.length > 0) {
            console.log('Successfully processed', processedData.length, 'rack entries');
            rackData = processedData;
            serverHallsData = serverHalls;
            return processedData;
          }
        }
        
        console.warn('ORD navigation failed or returned no data, falling back to traditional method');
        const fallbackData = await fallbackRackDataMethod();
        rackData = fallbackData;
        return fallbackData;
      } catch (err) {
        console.error('Error in getRackData:', err);
        return [];
      }
    }

    // ORD Path processing functions
    async function fetchOrdPaths() {
      try {
        const basePath = "station:|slot:/Drivers/NiagaraNetwork";
        console.log(`Attempting to fetch ORD paths from ${basePath}`);
        
        const parent = await baja.Ord.make(basePath).get({ subscriber: sub });
        
        if (!parent) {
          console.warn('NiagaraNetwork parent not found at', basePath);
          return { paths: [], serverHalls: [] };
        }

        const svrFolders = parent.getSlots()
          .properties()
          .isComponent()
          .toArray()
          .filter(slot => slot.getName().match(/SVR\d+_J\d+/i));

        console.log(`Found ${svrFolders.length} server hall folders`);

        const paths = [];
        const uniqueServerHalls = new Map();

        for (const svrFolder of svrFolders) {
          try {
            const svrPath = `${basePath}/${svrFolder.getName()}`;
            const svrComponent = await baja.Ord.make(svrPath).get();
            if (!svrComponent) continue;

            const rackSlots = svrComponent.getSlots()
              .properties()
              .isComponent()
              .toArray()
              .filter(slot => slot.getName().match(/(FF|SF)SH\d+/i));

            rackSlots.forEach(rack => paths.push(`${svrPath}/${rack.getName()}`));
            
            const hallInfo = getServerHallAndFloorFromOrd(svrPath);
            if (hallInfo) uniqueServerHalls.set(hallInfo.serverHall.code, hallInfo);
          } catch (err) {
            console.warn('Error processing server hall folder:', err);
          }
        }

        return { paths, serverHalls: Array.from(uniqueServerHalls.values()) };
      } catch (err) {
        console.error('[ERROR] fetchOrdPaths:', err);
        return { paths: [], serverHalls: [] };
      }
    }
    
  function getServerHallAndFloorFromOrd(ordPath) {
    try {
        const parts = ordPath.split('/');
        const hallPart = parts.find(p => p.match(/SVR(\d+)_J\d+/i));
        if (!hallPart) return null;
        
        const hallMatch = hallPart.match(/SVR(\d+)_J(\d+)/i);
        if (!hallMatch) return null;
        
        const hallNumber = parseInt(hallMatch[1], 10);
        const floorNumber = hallNumber <= 2 ? 1 : 2; // Adjust this logic as needed
        
        return {
            serverHall: {
                displayName: `Server Hall ${hallNumber}`,
                code: `SVR${hallMatch[1]}`,
                value: hallNumber
            },
            floor: {
                displayName: `Floor ${floorNumber}`,
                value: floorNumber
            }
        };
    } catch (err) {
        console.warn('Error parsing server hall info:', err);
        return null;
    }
}

async function processOrdPaths(paths, serverHalls) {
    const serverHallMap = new Map();
    
    for (const path of paths) {
        try {
            const hallInfo = getServerHallAndFloorFromOrd(path);
            if (!hallInfo) {
                console.warn('No hall info found for path:', path);
                continue;
            }
            
            const parts = path.split('/');
            const hallPart = parts.find(p => p.match(/SVR\d+/i));
            const rackPart = parts.find(p => p.match(/(FF|SF)SH\d+/i));
            
            if (!hallPart || !rackPart) continue;
            
            const hallMatch = hallPart.match(/SVR(\d+)/i);
            const rackMatch = rackPart.match(/^(FF|SF)SH(\d+)([A-Z]?)/i);
            
            if (!hallMatch || !rackMatch) continue;
            
            const serverHallNumber = parseInt(hallMatch[1]);
            const floorPrefix = rackMatch[1].toUpperCase();
            const floorId = floorPrefix === 'FF' ? 1 : 2;
            const rackLetter = rackMatch[3] || '';
            
            const rackBase = rackPart.replace(/^(FF|SF)SH\d+/i, '');
            
            const rackComponent = await baja.Ord.make(path).get();
            if (!rackComponent) continue;
            
            if (!serverHallMap.has(serverHallNumber)) {
                serverHallMap.set(serverHallNumber, {
                    id: serverHallNumber,
                    serverHall: `Server Hall ${serverHallNumber}`,
                    floor: floorId,
                    racks: []
                });
            }
            
            const serverHallData = serverHallMap.get(serverHallNumber);
            const rackMap = new Map();
            
            // Process all slots
            const slots = rackComponent.getSlots()
                .properties()
                .isComponent()
                .toArray();
            
            for (const slot of slots) {
    try {
        const slotName = slot.getName();
        if (slotName === 'SPARE') continue;
        
        const slotMatch = slotName.match(/^([A-Za-z])(\d+)/i) || 
                        slotName.match(/_([A-Za-z])(\d+)/i);
        if (!slotMatch) continue;
        
        const slotLetter = slotMatch[1].toUpperCase();
        const slotNumber = slotMatch[2];
        
        let locationPrefix;
        let rowLetter;
        
        if (rackBase.startsWith('CGNW')) {
            rowLetter = rackBase.slice(-1);
            locationPrefix = rowLetter;
        } else if (rackBase) {
            const rackLetter = rackBase.charAt(0).toUpperCase();
            rowLetter = 'A';
            locationPrefix = String.fromCharCode(rackLetter.charCodeAt(0) + 2);
        } else {
            rowLetter = slotLetter;
            locationPrefix = slotLetter;
        }
        
        const rackName = rackBase.startsWith('CGNW') 
            ? `${rackBase} ${slotLetter}_${slotNumber.padStart(2, '0')}`
            : `${rowLetter}_${slotNumber.padStart(2, '0')}`;
        
        const location = `${locationPrefix}_${slotNumber.padStart(2, '0')}`;
        const fullPath = `${path}/${slotName}`;
        
        if (!rackMap.has(rackName)) {
            rackMap.set(rackName, {
                rackname: rackName,
                type: 'rack',
                location: location,
                fullPath: fullPath,
                priSlotName:slotName,
                slotNames: []  // Changed from slots to slotNames array
            });
        }
        
        const rack = rackMap.get(rackName);
        
        // Get components under the slot
        const slotOrd = await baja.Ord.make(fullPath).get();
        
        if (slotOrd) {
            const components = slotOrd.getSlots()
                .properties()
                .isComponent()
                .toArray();
            
            for (const comp of components) {
                const compName = comp.getName();
                // Skip system properties
                if (compName === 'ApplicationName' || compName === 'AoName' || compName === 'highTemp' || compName === 'midTemp' || compName === 'lowTemp' || compName === 'midTempRh') continue;
                
                // Add component names directly to slotNames array
                rack.slotNames.push(compName);
            }
        }
    } catch (err) {
        console.warn('Error processing slot:', err);
    }
}
            
            for (const rack of rackMap.values()) {
                serverHallData.racks.push(rack);
            }
        } catch (err) {
            console.warn('Error processing path:', err);
        }
    }
    
    const serverHallArray = Array.from(serverHallMap.values())
        .sort((a, b) => a.id - b.id);
    
    console.log('Processed server halls:', serverHallArray);
    return serverHallArray;
}

    // Fallback methods
    async function fallbackRackDataMethod() {
      try {
        const stationRoot = await baja.$('station:|slot:/');
        if (!stationRoot) return [];
        
        const niagaraNetwork = stationRoot.get('Drivers')?.get('NiagaraNetwork');
        if (!niagaraNetwork) return [];
        
        const rackData = [];
        const rackMap = new Map();
        
        const serverHalls = niagaraNetwork.getChildren();
        for (const serverHall of serverHalls) {
          try {
            if (!(serverHall instanceof baja.Slot)) continue;
            
            const hallMatch = serverHall.getName().match(/SVR(\d+)_J\d+/i);
            if (!hallMatch) continue;
            
            const hallId = parseInt(hallMatch[1]);
            const racks = serverHall.getChildren();
            
            for (const rack of racks) {
              try {
                if (!(rack instanceof baja.Slot)) continue;
                
                const rackName = rack.getName();
                const rackMatch = rackName.match(/^(FF|SF)SH(\d+)/i);
                if (!rackMatch) continue;
                
                const floorPrefix = rackMatch[1].toUpperCase();
                const serverHallNumber = parseInt(rackMatch[2]);
                const floorId = floorPrefix === 'FF' ? 1 : 2;
                
                const rackBase = rackName.replace(/^(FF|SF)SH\d+/i, '');
                const slots = rack.getChildren();
                
                for (const slot of slots) {
                  try {
                    if (!(slot instanceof baja.Slot)) continue;
                    
                    const slotName = slot.getName();
                    if (slotName === 'SPARE') continue;
                    
                    const slotMatch = slotName.match(/^([A-Za-z])(\d+)/i) || 
                                    slotName.match(/_([A-Za-z])(\d+)_/i);
                    if (!slotMatch) continue;
                    
                    const slotLetter = slotMatch[1].toUpperCase();
                    const slotNumber = slotMatch[2];
                    
                    let locationPrefix;
                    if (rackBase.startsWith('CGNW')) {
                      locationPrefix = rackBase.slice(-1);
                    } else {
                      const rackLetter = rackBase.charAt(0).toUpperCase();
                      locationPrefix = String.fromCharCode(rackLetter.charCodeAt(0) + 2);
                    }
                    
                    const rackNameFormatted = rackBase.startsWith('CGNW') 
                      ? `${rackBase} ${slotLetter}_${slotNumber.padStart(2, '0')}`
                      : `${slotLetter}_${slotNumber.padStart(2, '0')}`;
                      
                    const rackKey = `${serverHallNumber}_${rackNameFormatted}`;
                    
                    if (!rackMap.has(rackKey)) {
                      rackMap.set(rackKey, true);
                      
                      rackData.push({
                        id: serverHallNumber,
                        serverHall: `${floorPrefix === 'FF' ? 'First Floor' : 'Second Floor'} - Server Hall ${serverHallNumber}`,
                        floor: floorId,
                        rack: {
                          rackName: rackNameFormatted,
                          type: 'Rack',
                          location: `${locationPrefix}_${slotNumber}`,
                          status: {
                            temperature: 'normal',
                            power: 'normal'
                          }
                        }
                      });
                    }
                  } catch (err) {
                    console.warn('Error processing slot:', err);
                  }
                }
              } catch (err) {
                console.warn('Error processing rack:', err);
              }
            }
          } catch (err) {
            console.warn('Error processing server hall:', err);
          }
        }
        
        return transformToExpectedFormat(rackData);
      } catch (err) {
        console.error('Error in fallback method:', err);
        return [];
      }
    }

    function transformToExpectedFormat(serverHallData) {
      return serverHallData.map(hall => {
        return {
          id: hall.id,
          serverHall: hall.serverHall,
          floor: hall.floor,
          racks: hall.racks.map(rack => ({
            rackname: rack.rackname,
            type: rack.type,
            location: rack.location,
            fullPath: rack.fullPath || '',
            slotName: rack.slotName || '',
            isThreePhase: rack.isThreePhase || false
          }))
        };
      });
    }

    // Public API
    return {
      getRackData,
      getServerHalls: () => serverHallsData,
      getRacks: () => rackData,
      getServerHallAndFloorFromOrd
    };
  })();
  
  // RackService module with proper DataService access
  const RackService = (function(dataService) {

const POINT_TYPES = {
  COMMON: [
    { key: 'highTemp', path: 'highTemp' },
    { key: 'lowTemp', path: 'lowTemp' },
    { key: 'midTemp', path: 'midTemp' },
    { key: 'humidity', path: 'midTempRh' }
    // { key: 'status', path: 'onnOffStatus' }
  ],
  SINGLE_PHASE: [
    { key: 'Kw', path: 'Kw' },
    { key: 'kwh', path: 'Kwh' }
  ],
  THREE_PHASE: [
    { key: 'redPhaseKw', path: 'RKw' },
    { key: 'yellowPhaseKw', path: 'YKw' },
    { key: 'bluePhaseKw', path: 'BKw' },
    { key: 'totalKw', path: 'totalKw' },
    { key: 'kwh', path: 'Kwh' }
  ]
};

async function fetchRackData(ordPath, slotNames, rackName) {  // Add rackName parameter
  try {
    console.log("ord path " + ordPath);
    const pathWithoutPrefix = ordPath.replace(/^station:\|slot:/, '').replace(/^\//, '');
    const parts = pathWithoutPrefix.split('/').filter(Boolean);
    const rackId = parts[parts.length - 1];
    const basePath = 'station:|slot:/' + parts.slice(0, -1).join('/');
    const a = this.rackName;
    console.log("rackName parts " + a);
    // If rackName wasn't provided, generate it from the path
    if (!rackName) {
  const prefixPart = parts[parts.length - 2]; // e.g., "SFSH4CGNWA"
  const slotPart = parts[parts.length - 1];   // e.g., "A01"

  rackName = `${prefixPart} ${slotPart}`;     // e.g., "SFSH4CGNWA A01"
  console.log("rackName:", rackName);
}

//     if (!rackName) {
//   const lastPart = parts[parts.length - 2];     // e.g., "SFSH4CGNWA"
//   const slotPart = parts[parts.length - 1];     // e.g., "A01"

//   // Extract trailing letters from the lastPart (e.g., CGNWA from SFSH4CGNWA)
//   const siteMatch = lastPart.match(/[A-Z]+$/);  // match capital letters at end
//   const siteCode = siteMatch ? siteMatch[0] : lastPart;

//   rackName = `${siteCode} ${slotPart}`;         // e.g., "CGNWA A01"
//   console.log("rackName:", rackName);
// }


    // Get server hall info
    const serverHallInfo = dataService.getServerHallAndFloorFromOrd(ordPath);
    const serverHall = serverHallInfo ? serverHallInfo.serverHall.displayName : 'Unknown';

    // Initialize rack data structure
    const rackData = {
      ordPath: basePath,
      serverHall: serverHall,
      rackName: rackName,  // Use the provided or generated rackName
      slots: [],
      highTemp: null,
      lowTemp: null,
      midTemp: null,
      humidity: null,
      status: 'Offline'
    };

    // First, fetch the temperature and humidity data points
    try {
      const tempHumidityPoints = [
        { key: 'highTemp', path: 'highTemp' },
        { key: 'lowTemp', path: 'lowTemp' },
        { key: 'midTemp', path: 'midTemp' },
        { key: 'humidity', path: 'midTempRh' },
        { key: 'applName', path: 'ApplicationName' },
        { key: 'aoName', path: 'AoName' },
      ];

      for (const { key, path } of tempHumidityPoints) {
        const pointPath = `${basePath}/${rackId}/${path}`;
        try {
          const value = await throttledFetchPointValue(pointPath);
          if (value !== null && value !== undefined) {
            rackData[key] = value.toString(); // Convert to string to match example
          }
        } catch (error) {
          console.warn(`Error fetching ${pointPath}:`, error);
        }
      }
    } catch (error) {
      console.error('Error fetching temperature/humidity data:', error);
    }

    // Process each slot
    for (const slotName of slotNames) {
      try {
        const location = getRackLocationFromId(slotName);
        const rackName = getRackNameFromId(slotName);
        const isThreePhase = slotName.includes('_T');
        const isSinglePhase = slotName.includes('_S');

        const slotData = {
          slotName: slotName,
          location: location,
          isThreePhase: isThreePhase,
          source: slotName.includes('S1') ? 'Source 1' : 'Source 2'
        };

        // Determine which points to fetch based on slot type
        const measurementPoints = isThreePhase ? [
          { key: 'RKw', path: 'RKw' },
          { key: 'YKw', path: 'YKw' },
          { key: 'BKw', path: 'BKw' },
          { key: 'totalKw', path: 'totalKw' },
          { key: 'Kwh', path: 'Kwh' }
        ] : [
          { key: 'Kwh', path: 'Kwh' },
          { key: 'Kw', path: 'Kw' }
        ];

        // Process all points for this slot
        for (const { key, path } of measurementPoints) {
          const pointPath = `${basePath}/${rackId}/${slotName}/${path}`;
          try {
            const value = await throttledFetchPointValue(pointPath);
            if (value !== null && value !== undefined) {
              slotData[key] = value.toString();
            }
          } catch (error) {
            console.warn(`Error fetching ${pointPath}:`, error);
          }
        }

        // Add to slots array
        rackData.slots.push(slotData);

      } catch (error) {
        console.error(`Error processing slot ${slotName}:`, error);
      }
    }

    // Set status based on if we got any data (either power or temperature/humidity)
    const hasPowerData = rackData.slots.length > 0 && 
                         rackData.slots.some(slot => 'Kw' in slot || 'Kwh' in slot);
    const hasTempData = rackData.highTemp !== null || rackData.lowTemp !== null || 
                       rackData.midTemp !== null || rackData.humidity !== null;
    
    if (hasPowerData || hasTempData) {
      rackData.status = 'Online';
    }

    console.log("rackData:", JSON.stringify(rackData, null, 2));
    return rackData;

  } catch (error) {
    console.error(`Error processing rack ${ordPath}:`, error);
    return null;
  }
}


        const sub = new baja.Subscriber();
    console.log("[INIT] RackService initialized with Subscriber:", sub);

    // Throttling setup
    const requestQueue = [];
    let activeRequests = 0;
    const MAX_CONCURRENT_REQUESTS = 5;

    async function throttledFetchPointValue(ordPath) {
        return new Promise((resolve) => {
            const execute = async () => {
                activeRequests++;
                try {
                    const result = await fetchPointValue(ordPath);
                    resolve(result);
                } finally {
                    activeRequests--;
                    if (requestQueue.length > 0) {
                        requestQueue.shift()();
                    }
                }
            };
            
            if (activeRequests < MAX_CONCURRENT_REQUESTS) {
                execute();
            } else {
                requestQueue.push(execute);
            }
        });
    }
  
    async function fetchPointValue(ordPath) {
    try {
        const ord = baja.Ord.make(ordPath);
        console.log("fetchpointpath " + ord);
        if (!ord) {
            console.error(`Invalid ORD: ${ordPath}`);
            return null;
        }

        const point = await ord.get({ subscriber: sub });
        if (!point) {
            console.warn(`No valid object found at: ${ordPath}`);
            return null;
        }

        const displayValue = point.getDisplay();
        console.log("displayvalue" + displayValue);
        if (!displayValue) {
            console.warn(`No display value found at: ${ordPath}`);
            return null;
        }
        
        let modifiedValue;
        const bpoint = point.getTypeDisplayName();
        console.log("bpointpath " + bpoint);
        
        // Handle different point types
        if (bpoint === "Boolean Writable") {
            modifiedValue = displayValue.replace(/^(true|false)(.+)?$/i, "$1");
        } 
        else if (bpoint === "String Writable") {
            // For String Writable, return the full display value without modification
            modifiedValue = displayValue.split(/[{@]/)[0].trim();
        }
        else {
            // For numeric points, extract just the numeric part
            modifiedValue = displayValue.replace(/(^\d+)(.+$)/i, "$1");
        }
        
        console.log("modified value " + modifiedValue);
        return modifiedValue;
    } catch (error) {
        console.error(`Error getting value from ${ordPath}:`, error);
        return null;
    }
}

    function getRackLocationFromId(rackId) {
      const match = rackId.match(/([A-Z])(\d+)/i);
      return match ? `${match[1]}_${match[2].padStart(2, '0')}` : rackId;
    }

    function getRackNameFromId(rackId) {
      const match = rackId.match(/([A-Z])(\d+)/i);
      return match ? `Rack ${match[1]}${match[2]}` : rackId;
    }

    return {
      fetchRackData,
      fetchPointValue: throttledFetchPointValue 
    };
  })(DataService);

  // UI Manager
   const UIManager = (function () {
        let sc;
        let $cart, $counter, $total;
        let currentViewMode = VIEW_MODES.TEMPERATURE;
        async function updateLegendWithSetPoints(serverHallCode) {
    try {
        const setPoints = await fetchSetPoints(serverHallCode);
        
        // Update temperature legend
        $('#highTempLegend').text(`Above ${setPoints.highLimit}°C`);
console.log(`[DEBUG] #highTempLegend set to: Above ${setPoints.highLimit}°C`);

$('#normalTempLegend').text(`${setPoints.lowLimit}-${setPoints.highLimit}°C`);
console.log(`[DEBUG] #normalTempLegend set to: ${setPoints.lowLimit}-${setPoints.highLimit}°C`);

$('#lowTempLegend').text(`Below ${setPoints.lowLimit}°C`);
console.log(`[DEBUG] #lowTempLegend set to: Below ${setPoints.lowLimit}°C`);

        
        // Update power legend (using default values or you could fetch these too)
        $('#highPowerLegend').text('Above 1000 W');
        $('#normalPowerLegend').text('500 - 1000 W');
        $('#lowPowerLegend').text('100 - 500 W');
        
    } catch (error) {
        console.error('Error updating legend with set points:', error);
        // Fallback to default values
        $('#highTempLegend').text('Above 30°C');
        $('#normalTempLegend').text('20-30°C');
        $('#lowTempLegend').text('Below 20°C');
    }
}

// Call this function when initializing the UI or when server hall changes
function initializeUI() {
    $counter = $('#counter');
    $total = $('#total');
    $cart = $('#selected-seats');
    setupEventHandlers();
    updateViewMode();
    
    // Update legend with set points when UI initializes
    const initialHall = $('#servers').val();
    if (initialHall) {
        const match = initialHall.match(/\d+/);
        const hallNumber = match ? match[0].padStart(2, '0') : "00";
        const serverHallCode = `SVR${hallNumber}`;
        updateLegendWithSetPoints(serverHallCode);
    }
}

        
        function setupEventHandlers() {
            $(".tempbtn").click(e => setViewMode(VIEW_MODES.TEMPERATURE));
            $(".powerbtn").click(e => setViewMode(VIEW_MODES.POWER));

            $("#dataTab").change(function () {
                setViewMode($(this).val());
            });
            // Also update legend when server hall changes
            $("#servers").change(function() {
                const selected = $(this).val();
                if (!selected) return;
                
                const match = selected.match(/\d+/);
                const hallNumber = match ? match[0].padStart(2, '0') : "00";
                const serverHallCode = `SVR${hallNumber}`;
                updateLegendWithSetPoints(serverHallCode);
                
                updateSeatMap(selected);
            });

            // $("#servers").change(function () {
            //     const selected = $(this).val();
            //     if (!selected) {
            //         console.warn('[DEBUG] No server hall selected.');
            //         return;
            //     }
            //     updateSeatMap(selected);
            // });

            $("#floors").change(() => updateServers());
        }

       window.setViewMode = function(mode) {
    currentViewMode = mode;
    window.location.hash = mode === VIEW_MODES.POWER ? 'powerSts' : 'tempSts';
    
    // Update UI elements
    $(".brdrBox.floor-details.tempSts").toggleClass("visible", mode === VIEW_MODES.TEMPERATURE);
    $(".brdrBox.floor-details.powerSts").toggleClass("visible", mode === VIEW_MODES.POWER);
    $("#legend").toggleClass("tempStatusLegend", mode === VIEW_MODES.TEMPERATURE);
    $("#legend").toggleClass("powerStatusLegend", mode === VIEW_MODES.POWER);
    $(".floorLayout").toggleClass("tempStatusSec", mode === VIEW_MODES.TEMPERATURE);
    $(".floorLayout").toggleClass("powerStatusSec", mode === VIEW_MODES.POWER);
    
    // Refresh the seat map display
    const selectedServerHall = $('#servers').val();
    if (selectedServerHall) {
        updateSeatMap(selectedServerHall);
    }
};

window.updateViewMode = function() {
    const isPowerView = currentViewMode === VIEW_MODES.POWER;
    try {
        window.location.hash = isPowerView ? 'powerSts' : 'tempSts';
        
        $(".brdrBox.floor-details.tempSts").toggleClass("visible", !isPowerView);
        $(".brdrBox.floor-details.powerSts").toggleClass("visible", isPowerView);
        $("#legend").toggleClass("tempStatusLegend", !isPowerView);
        $("#legend").toggleClass("powerStatusLegend", isPowerView);
        $(".floorLayout").toggleClass("tempStatusSec", !isPowerView);
        $(".floorLayout").toggleClass("powerStatusSec", isPowerView);
    } catch (error) {
        console.error('[ERROR] Error handling view change:', error);
    }
};


        function createDynamicSelectors(serverHalls) {
            const floors = [...new Set(serverHalls.map(h => h.floor.value))].sort();
            $('#floors').empty().append(floors.map(f => 
                `<option value="${f}">Floor ${f}</option>`
            ));
            
            const halls = [...new Set(serverHalls.map(h => h.serverHall.value))].sort();
            $('#servers').empty().append(halls.map(h => 
                `<option value="${h}">Server Hall ${h}</option>`
            ));
        }

        function updateServers() {
            const selectedFloor = $('#floors').val();
            console.log('[DEBUG] updateServers called with floor:', selectedFloor);
            
            const $serversDropdown = $('#servers');
            const rackData = DataService.getRacks();
            console.log('[DEBUG] Available rack data:', rackData);
            
            $serversDropdown.empty();
            
            $serversDropdown.append($('<option>', {
                value: '',
                text: 'Select Server Hall',
                disabled: true,
                selected: true
            }));
            
            const serverHalls = rackData.filter(item => item.floor == selectedFloor);
            console.log('[DEBUG] Filtered server halls:', serverHalls);
            
            serverHalls.forEach(function(hall) {
                $serversDropdown.append($('<option>', {
                    value: hall.serverHall,
                    text: hall.serverHall
                }));
            });
            
            if (serverHalls.length > 0) {
                const firstHall = serverHalls[0].serverHall;
                console.log('[DEBUG] Selecting first available hall:', firstHall);
                $serversDropdown.val(firstHall);
                updateSeatMap(firstHall);
            } else {
                console.log('[DEBUG] No server halls available for selected floor');
                if (sc) {
                    console.log('[DEBUG] Clearing empty seat map');
                    $('#seat-map').empty();
                    sc = null;
                }
            }
        }

        async function updateSeatMap(serverHall) {
            try {
                console.log('[DEBUG] updateSeatMap called with serverHall:', serverHall);
                
                if (typeof $ === 'undefined') {
                    throw new Error('jQuery not loaded');
                }
                if (typeof $.fn.seatCharts === 'undefined') {
                    throw new Error('SeatCharts plugin not loaded');
                }
                
                const hallsData = DataService.getRacks();
                if (!Array.isArray(hallsData)) {
                    throw new Error('Invalid halls data format');
                }
                
                const selectedHall = hallsData.find(item => item.serverHall === serverHall);
                console.log('[DEBUG] Selected hall data:', selectedHall);
                
                const $seatMap = $('#seat-map');
                const $cart = $('#selected-seats');
                const $counter = $('#counter');
                const $total = $('#total');
                
                if (window.sc && typeof window.sc === 'object') {
                    console.log('[DEBUG] Destroying previous seat chart instance');
                    try {
                        $seatMap.seatCharts('destroy');
                    } catch (e) {
                        console.warn('[WARN] Error destroying previous chart:', e);
                    }
                }
                
                $seatMap.empty().removeData();
                window.sc = null;
                $cart.empty();
                $counter.text('0');
                $total.text('0');
                
                if (!selectedHall) {
                    console.warn('[WARN] No hall data found for:', serverHall);
                    $seatMap.html('<div class="alert alert-warning">Server hall data not available</div>');
                    return;
                }
                
                if (!Array.isArray(selectedHall.racks) || selectedHall.racks.length === 0) {
                    console.warn('[WARN] No racks found for hall:', serverHall);
                    $seatMap.html('<div class="alert alert-info">No racks available in this server hall</div>');
                    return;
                }
                
                console.log('[DEBUG] Initializing new seat chart for:', serverHall);
                await initializeSeatMap(serverHall);
                
            } catch (error) {
                console.error('[ERROR] updateSeatMap failed:', error);
                $('#seat-map').html(
                    `<div class="alert alert-danger">
                        Failed to update seat map: ${error.message}<br>
                        ${error.stack || ''}
                    </div>`
                );
            }
        }

        async function initializeSeatMap(serverHall) {
            try {
                console.log('[DEBUG] initializeSeatMap called for:', serverHall);
                
                if (typeof $.fn.seatCharts === 'undefined') {
                    throw new Error('SeatCharts plugin not loaded');
                }
                
                const selectedHall = DataService.getRacks().find(item => item.serverHall === serverHall);
                console.log("Selected server hall data:", JSON.stringify(selectedHall, null, 2));
                
                if (!selectedHall || !Array.isArray(selectedHall.racks)) {
                    throw new Error('Invalid hall data - missing or invalid racks array');
                }

                console.log('[DEBUG] Total racks in selected hall:', selectedHall.racks.length);
                
                const rackArray = selectedHall.racks.map(rack => {
                    if (!rack.location) {
                        console.warn('[WARN] Rack missing location:', rack);
                        return null;
                    }
                    
                    const loc = rack.location.toString().toUpperCase().replace(/[^A-Z0-9_]/g, '');
                    const [letter, number] = loc.split('_');
                    
                    if (!letter || !number) {
                        console.warn('[WARN] Invalid location format:', rack.location);
                        return null;
                    }

                    const formatted = `${letter}_${number.padStart(2, '0')}`;
                    console.log('[DEBUG] Valid rack location:', formatted);
                    return {
                        id: formatted,
                        letter: letter,
                        number: number,
                        rackInfo: rack
                    };
                }).filter(Boolean);
                
                if (rackArray.length === 0) {
                    throw new Error('No valid rack locations found');
                }
                
                console.log('[DEBUG] Processed rack locations:', rackArray);
                
                const letters = new Set();
                const numbers = new Set();
                
                rackArray.forEach(loc => {
                    letters.add(loc.letter);
                    numbers.add(parseInt(loc.number, 10));
                });
                
                const rowLetters = Array.from(letters).sort();
                const maxCol = Math.max(...Array.from(numbers));
                
                console.log('[DEBUG] Row letters:', rowLetters, 'Max column:', maxCol);
                
                const mapData = rowLetters.map(letter => {
                    const row = Array(maxCol).fill('_');
                    rackArray.forEach(loc => {
                        if (loc.letter === letter) {
                            const col = parseInt(loc.number, 10) - 1;
                            if (col >= 0 && col < maxCol) {
                                row[col] = 'x';
                            }
                        }
                    });
                    return row.join('');
                });
                
                console.log('[DEBUG] Generated map data:', mapData);
                
                const $seatMap = $('#seat-map').empty();
                
                window.sc = $seatMap.seatCharts({
                    map: mapData,
                    seats: {
                        f: {
                            price: 100,
                            classes: 'rack-class',
                            category: 'Rack'
                        },
                        e: {
                            price: 40,
                            classes: 'low-class',
                            category: 'Low'
                        },
                        d: {
                            price: 40,
                            classes: 'normal-class',
                            category: 'Normal'
                        }, 
                        c: {
                            price: 100,
                            classes: 'high-class',
                            category: 'High'
                        },  
                        b: {
                            price: 100,
                            classes: 'blue-class',
                            category: 'empty'
                        },
                        _: {
                            price: 0,
                            classes: 'empty-class',
                            category: 'Empty'
                        }
                    },
                    rendering: {
                    delay: 10,     // Delay in milliseconds between each render batch
                    batchSize: 50   // Number of seats rendered per batch
                    },
                    naming: {
                        top: true,
                        rows: rowLetters,
                        columns: Array.from({length: maxCol}, (_, i) => (i + 1).toString()),
                        getLabel: function(character, row, column) {
                            return row + " " + column.toString().padStart(2, '0');
                        },
                    },
                    click: function() {
                        console.log('[DEBUG] Seat clicked:', this.settings.id);
                        console.log('[DEBUG] Seat status before click:', this.status());
                        return handleSeatClick.call(this, window.sc); 
                    }
                });
                console.log('[DEBUG] All generated seat IDs:');
                Object.keys(window.sc.seats).forEach(id => {
                    console.log("window seat" + id);
                });
                
                if (!window.sc || !window.sc.seats) {
    console.error('Seat chart not initialized');
    return;
}
const rackMap = {};
rackArray.forEach(loc => {
    // Store multiple possible ID formats for flexible matching
    const cleanId = loc.id.replace(/_(0)(\d)/, '_$2');
    console.log("mapp array " + cleanId);
    rackMap[loc.id] = loc;
    rackMap[cleanId] = loc;
    rackMap[loc.id.replace(/_/g, '-')] = loc;
    rackMap[loc.id.replace(/-/g, '_')] = loc;
});

// Object.keys(window.sc.seats).forEach(async (seatId) => {
//     try {
//         console.log(`Processing seat ${seatId}`);
        
//         // Get the actual DOM element
//         const seatElement = document.getElementById(seatId);
//         if (!seatElement) {
//             console.warn(`Seat element ${seatId} not found in DOM`);
//             return;
//         }

//         // Find matching rack info using our pre-built map
//         const matchingLoc = rackMap[seatId];
        
//         if (!matchingLoc) {
//             console.warn(`No rack info found for seat ${seatId}`);
//             seatElement.classList.remove('high-class', 'normal-class', 'low-class', 'blue-class');
//             seatElement.classList.add('rack-class');
//             return;
//         }

//         // Construct the full path correctly
//         const rackInfo = matchingLoc.rackInfo;
//         const formattedSeatId = `${matchingLoc.letter}${matchingLoc.number.padStart(2, '0')}`;
//         const fullPath = `${rackInfo.fullPath}/${formattedSeatId}`;
//         console.log("full path " + fullPath);
        
//         console.log("Fetching data for path:", fullPath);
        
//         // Fetch rack data with the properly constructed path
//         const rackData = await RackService.fetchRackData(
//             fullPath,  // Now using the properly constructed full path
//             formattedSeatId,// Passing the formatted seat ID (A01, B02, etc.)
//             rackInfo
//         );
//         console.log("rackDatarackInfo:", JSON.stringify(rackData, null, 2));

//         // Rest of your processing code...
//         if (!rackData) {
//             console.warn(`[WARN] No data available for rack ${seatId}`);
//             seatElement.classList.remove('high-class', 'normal-class', 'low-class', 'blue-class');
//             seatElement.classList.add('rack-class');
//             return;
//         }

//         // Process the rack data...
//     } catch (err) {
//         console.error(`[ERROR] Failed to set status for ${seatId}:`, err);
//         // Error handling...
//     }
// });

Object.keys(window.sc.seats).forEach(async (seatId) => {
    try {
        console.log(`Processing seat ${seatId}`);
        const seatElement = document.getElementById(seatId);
        if (!seatElement) {
            console.warn(`Seat element ${seatId} not found in DOM`);
            return;
        }

        // Clean and format seat ID
        const clean = seatId.replace(/[^a-zA-Z0-9]/g, '');
        const match = clean.match(/^([A-Za-z])(\d+)$/);
        if (!match) {
            console.warn(`Invalid seat ID format: ${seatId}`);
            return;
        }
        
        const letter = match[1].toUpperCase();
        const number = match[2].padStart(2, '0');
        const formattedSeatId = `${letter}_${number}`;

        // Find matching rack info
        const selectedServerHall = $('#servers').val();
        const hallData = DataService.getRacks().find(h => h.serverHall === selectedServerHall);
        if (!hallData) {
            console.warn(`No hall data for ${selectedServerHall}`);
            return;
        }

        const rackInfo = hallData.racks.find(r => 
            r.location === formattedSeatId || 
            r.rackname === formattedSeatId ||
            r.rackname.endsWith(formattedSeatId)
        );
        
        if (!rackInfo) {
            console.warn(`No matching rack found for ${formattedSeatId}`);
            seatElement.classList.remove('high-class', 'normal-class', 'low-class', 'blue-class');
            seatElement.classList.add('rack-class');
            return;
        }

        // Fetch rack data
        const rackData = await RackService.fetchRackData(
            rackInfo.fullPath,
            rackInfo.slotNames,
            rackInfo.rackName
        );
        
        if (!rackData) {
            console.warn(`No data for rack ${formattedSeatId}`);
            seatElement.classList.remove('high-class', 'normal-class', 'low-class', 'blue-class');
            seatElement.classList.add('rack-class');
            return;
        }

        // Get server hall number for set points
        const hallMatch = selectedServerHall.match(/\d+/);
        const hallNumber = hallMatch ? hallMatch[0] : "00";
        const serverHallCode = `SVR${hallNumber.padStart(2, '0')}`;
        const setPoints = await UIManager.fetchSetPoints(serverHallCode);

        // Apply classes based on current view mode
        if (currentViewMode === VIEW_MODES.TEMPERATURE) {
            // Temperature view mode logic
            const highTemp = parseFloat(rackData.highTemp) || 0;
            const midTemp = parseFloat(rackData.midTemp) || 0;
            const lowTemp = parseFloat(rackData.lowTemp) || 0;
            const humidity = parseFloat(rackData.humidity) || 0;

            // Check if any value exceeds high limit
            if (highTemp > setPoints.highLimit || 
                midTemp > setPoints.highLimit || 
                lowTemp > setPoints.highLimit || 
                humidity > setPoints.highLimit) {
                seatElement.classList.remove('normal-class', 'low-class', 'blue-class');
                seatElement.classList.add('high-class');
            } 
            // Check if any value is below low limit
            else if (highTemp < setPoints.lowLimit || 
                     midTemp < setPoints.lowLimit || 
                     lowTemp < setPoints.lowLimit || 
                     humidity < setPoints.lowLimit) {
                seatElement.classList.remove('high-class', 'normal-class', 'blue-class');
                seatElement.classList.add('low-class');
            } 
            // All values are within normal range
            else {
                seatElement.classList.remove('high-class', 'low-class', 'blue-class');
                seatElement.classList.add('normal-class');
            }
        } else {
            // Power view mode logic
            let totalKw = 0;
            if (rackData.slots) {
                totalKw = rackData.slots.reduce((sum, slot) => {
                    return sum + (parseFloat(slot.totalKw || slot.Kw || 0) || 0);
                }, 0);
            }

            if (totalKw === 0) {
                seatElement.classList.remove('normal-class', 'low-class', 'blue-class');
                seatElement.classList.add('high-class');
            } else if (totalKw > 500) {
                seatElement.classList.remove('high-class', 'low-class', 'blue-class');
                seatElement.classList.add('normal-class');
            } else {
                seatElement.classList.remove('high-class', 'normal-class', 'blue-class');
                seatElement.classList.add('low-class');
            }
        }

    } catch (err) {
        console.error(`Failed to set status for ${seatId}:`, err);
        const seatElement = document.getElementById(seatId);
        if (seatElement) {
            seatElement.classList.remove('high-class', 'normal-class', 'low-class', 'blue-class');
            seatElement.classList.add('rack-class');
        }
    }
});

                console.log('[DEBUG] Seat chart initialized successfully');
                
                // Process each rack to set initial status
// for (const loc of rackArray) {
//     try {
//         const rackInfo = loc.rackInfo;
//         // const seatId = loc.id;
//         const seatId = loc.id.replace(/_(0*)([1-9]\d*)$/, '_$2');
//         console.log("seat Id for " + seatId);

//         // const seat = window.sc.find(seatId);
        
//         let id = loc.id;
//         const escapedId = id.replace(/([ #;?%&,.+*~\':"!^$[\]()=>|\/@])/g, "\\$1");
//         console.log("eas " + escapedId );
//         const seat = window.sc.find(escapedId);
//         // Or use jQuery with `#${escapedId}`
//         console.log("seat (stringified):", JSON.stringify(seat, null, 2));  // Fixed typo here
                
//         if(seat.startsWith('#')){
//             console.log("start seat with # " + id);
//         }
        
//         if (!seat) {
//             console.warn(`[WARN] Seat not found for ${seatId}`);
//             continue;
//         }

//         const rackData = await RackService.fetchRackData(
//             rackInfo.fullPath,
//             rackInfo.slotNames || [],
//             rackInfo
//         );

//         if (!rackData) {
//             console.warn(`[WARN] No data available for rack ${seatId}`);
//             seat.status('rack-class');
//             continue;
//         }

//         // Extract temperature values
//         const highTemp = parseFloat((rackData.highTemp?.split(' ')[0]) || 0);
//         const midTemp = parseFloat((rackData.midTemp?.split(' ')[0]) || 0);
//         const lowTemp = parseFloat((rackData.lowTemp?.split(' ')[0]) || 0);

//         // Calculate total power usage
//         let totalKw = rackData.totalKw || 0;
//         let totalKwh = rackData.kwh || 0;

//         if (rackData.slots) {
//             totalKw = rackData.slots.reduce((sum, slot) => sum + (slot.totalKw || slot.Kw || 0), 0);
//             totalKwh = rackData.slots.reduce((sum, slot) => sum + (slot.kwh || 0), 0);
//         }

//         // Determine seat status
//         if (totalKw === 0 || totalKwh === 0) {
//             seat.node()
//               .removeClass('rack-class normal-class low-class blue-class')
//               .addClass('high-class');
//             seat.status('high-class');
//         } else if (highTemp > 30 || midTemp > 30 || lowTemp > 30) {
//             seat.node()
//               .removeClass('rack-class normal-class low-class blue-class')
//               .addClass('high-class');
//             seat.status('high-class');
//         } else {
//             seat.node()
//               .removeClass('high-class normal-class low-class blue-class')
//               .addClass('rack-class');
//             seat.status('rack-class');
//         }
//     } catch (err) {
//         console.error(`[ERROR] Failed to set status for ${loc.id}:`, err);
//         const seat = window.sc.find(loc.id);
//         if (seat) {
//             seat.status('rack-class');
//         }
//     }
// }
                
                console.log('[DEBUG] Calling updateViewMode...');
                updateViewMode();
                
                console.log('[DEBUG] initializeSeatMap finished');
                return window.sc;
                
            } catch (error) {
                console.error('[ERROR] initializeSeatMap failed:', error);
                $('#seat-map').html(
                    `<div class="alert alert-danger">
                        Seat map initialization failed: ${error.message}<br>
                        ${error.stack || ''}
                    </div>`
                );
                throw error;
            }
        }
        
         async function fetchSetPoints(serverHallCode) {
        try {
          console.log("serverHallCode " + serverHallCode);
            const highLimitPath = `station:|slot:/setPoints/${serverHallCode}/highLimit`;
            const lowLimitPath = `station:|slot:/setPoints/${serverHallCode}/lowLimit`;
            
            const [highLimit, lowLimit] = await Promise.all([
                RackService.fetchPointValue(highLimitPath),
                RackService.fetchPointValue(lowLimitPath)
            ]);
            
            return {
                highLimit: parseFloat(highLimit) || 30,
                lowLimit: parseFloat(lowLimit) || 20
            };
        } catch (error) {
            console.error(`Error fetching set points for ${serverHallCode}:`, error);
            return {
                highLimit: 30,
                lowLimit: 20
            };
        }
    }

function powerStatus(hallNumber) {
    const serverHallCode = `SVR${String(hallNumber).padStart(2, '0')}`;
    const powerLimitHigh = 100;
    const powerLimitLow = 10;
    
    ['powerValue', 'powerValue1'].forEach(id => {
        const element = $(`#${id} a`);
        const powerText = element.text().replace(/[^\d.]/g, '');
        const powerVal = parseFloat(powerText) || 0;
        
        console.log(`Processing ${id}:`, {
            element: element,
            text: element.text(),
            powerText: powerText,
            powerVal: powerVal
        });
        
        element.removeClass("alertDanger alertWarning alertSuccess").addClass(
            powerVal > powerLimitHigh ? "alertDanger" :
            powerVal < powerLimitLow ? "alertWarning" :
            "alertSuccess"
        );
    });
}

    function tempStatus(hallNumber) {
        const serverHallCode = `SVR${String(hallNumber).padStart(2, '0')}`;
        fetchSetPoints(serverHallCode).then(setPoints => {
            const highTemp = parseFloat($("#highTemp").text()) || 0;
            const midTemp = parseFloat($("#midTemp").text()) || 0;
            const lowTemp = parseFloat($("#lowTemp").text()) || 0;
            const midTempRh = parseFloat($("#midTempRh").text()) || 0;

            $("#highTemp").removeClass("alertDanger alertSuccess alertWarning").addClass(
                highTemp > setPoints.highLimit ? "alertDanger" :
                highTemp < setPoints.lowLimit ? "alertWarning" : "alertSuccess"
            );

            $("#midTemp").removeClass("alertDanger alertSuccess alertWarning").addClass(
                midTemp > setPoints.highLimit ? "alertDanger" :
                midTemp < setPoints.lowLimit ? "alertWarning" : "alertSuccess"
            );

            $("#lowTemp").removeClass("alertDanger alertSuccess alertWarning").addClass(
                lowTemp > setPoints.highLimit ? "alertDanger" :
                lowTemp < setPoints.lowLimit ? "alertWarning" : "alertSuccess"
            );

            $("#midTempRh").removeClass("alertDanger alertSuccess alertWarning").addClass(
                midTempRh > setPoints.highLimit ? "alertDanger" :
                midTempRh < setPoints.lowLimit ? "alertWarning" : "alertSuccess"
            );
        });
    }

// Then modify the handleSeatClick function to use these properly
async function handleSeatClick(sc) {
    try {
        const rackId = this.settings.id;
        const [row, number] = rackId.split('_');
        const paddedNumber = number.padStart(2, '0');
        const paddedRackId = `${row}_${paddedNumber}`;

        const selectedServerHall = $('#servers').val();
        if (!selectedServerHall) {
            console.warn('No server hall selected');
            return 'available';
        }

        const hallData = DataService.getRacks().find(h => 
            h.serverHall === selectedServerHall
        );

        if (!hallData) {
            console.warn(`No hall data for ${selectedServerHall}`);
            return 'available';
        }

        // Find matching rack
        const rackInfo = hallData.racks.find(r => {
            return r.location === paddedRackId || 
                   r.rackname === paddedRackId ||
                   r.rackname.endsWith(paddedRackId);
        });
        
        if (!rackInfo) {
            console.warn(`No matching rack found for ${rackId} in ${selectedServerHall}`);
            return 'available';
        }

        const match = selectedServerHall.match(/\d+/);
        const hallNumber = match ? match[0].padStart(2, '0') : "00";

        const rackData = await RackService.fetchRackData(
            rackInfo.fullPath,
            rackInfo.slotNames,
            rackInfo.rackName
        );
        
        if (!rackData) {
            console.warn(`No data for rack ${rackInfo.location}`);
            return 'available';
        }

        await updateRackDetailsUI(rackData, hallNumber);
        
        // Call the appropriate status function based on current view mode
        if (currentViewMode === VIEW_MODES.POWER) {
            UIManager.powerStatus(hallNumber);
        } else {
            UIManager.tempStatus(hallNumber);
        }

        if (this.status() === 'available') {
            const totalKw = rackData.totalKw ?? 0;
            $(`<li id="cart-item-${rackId}">${rackInfo.rackname}: ${totalKw} kW</li>`)
                .appendTo($cart);
            updateSelectionCounters(sc);
            return 'selected';
        } else {
            $(`#cart-item-${rackId}`).remove();
            updateSelectionCounters(sc);
            return 'available';
        }
    } catch (err) {
        console.error('Seat click error:', err);
        return 'available';
    }
}

async function updateRackDetailsUI(data, hallNumber) {
    const serverHallCode = `SVR${hallNumber}`;
    
    // First fetch the set points
    const setPoints = await UIManager.fetchSetPoints(serverHallCode);
    const powerLimit = 100; // Default power limit if not defined in setPoints
    
    $("#rackDetails").hide();
    $("#wholerack").show();
    $(".rackProperty td").addClass("showCol");
    $(".rackProperty#tempStats").addClass("showCol");
    $(".rackProperty#powerStats").addClass("showCol");
    $("a.btn.btn-primary.rackLink").addClass("showCol");

    // Update rack info
    $("#rackName").html(data.rackName);
    $("#appliName").html(data.applName);
    $("#aoName").html(data.aoName);

    // Update temperature
    $('#highTemp').text(data.highTemp ?? 'N/A');
    $('#lowTemp').text(data.lowTemp ?? 'N/A');
    $('#midTemp').text(data.midTemp ?? 'N/A');
    $('#midTempRh').text(data.humidity ? `${data.humidity}%` : 'N/A');

    const highTemp = parseFloat(data.highTemp) || 0;
    const midTemp = parseFloat(data.midTemp) || 0;
    const lowTemp = parseFloat(data.lowTemp) || 0;
    const midTempRh = parseFloat(data.humidity) || 0;
    
    $(".three-phase, .single-phase").hide();

    if (data.slots) {
        data.slots.forEach((slot, idx) => {
            const source = slot.source === "Source 1" ? "source1" : "source2";
            const powerId = source === "source1" ? "#powerValue" : "#powerValue1";

            if (slot.isThreePhase) {
    $(`.${source}.three-phase`).show();

    // Parse values for alert logic
    const RKw = parseFloat(slot.RKw) || 0;
    const YKw = parseFloat(slot.YKw) || 0;
    const BKw = parseFloat(slot.BKw) || 0;
    const totalKw = parseFloat(slot.totalKw) || 0;

    // Update and style each phase row
    const rows = $(`.${source}.three-phase`);
    
    // R Phase
    rows.eq(0).find("td").eq(1)
        .text(slot.RKw || "0")
        .removeClass("alertDanger alertSuccess")
        .addClass(RKw > powerLimit ? "alertDanger" : "alertSuccess");

    // Y Phase
    rows.eq(1).find("td").eq(1)
        .text(slot.YKw || "0")
        .removeClass("alertDanger alertSuccess")
        .addClass(YKw > powerLimit ? "alertDanger" : "alertSuccess");

    // B Phase
    rows.eq(2).find("td").eq(1)
        .text(slot.BKw || "0")
        .removeClass("alertDanger alertSuccess")
        .addClass(BKw > powerLimit ? "alertDanger" : "alertSuccess");

    // Total Kw
    rows.eq(3).find("td").eq(1)
        .text(slot.totalKw || "0")
        .removeClass("alertDanger alertSuccess")
        .addClass(totalKw > powerLimit ? "alertDanger" : "alertSuccess");

    // // kWh – usually not alert-critical, so just update value
    // rows.eq(4).find("td").eq(1).text(slot.Kwh || "0");
    
    rows.eq(4).find("td").eq(1)
    .text(slot.Kwh || "0")
    .removeClass("alertDanger alertSuccess")
    .addClass((parseFloat(slot.Kwh) || 0) > powerLimit ? "alertDanger" : "alertSuccess");

    // Power display
    $(powerId).text(`${slot.totalKw || 0} kW`);
    console.log(`[DEBUG] Setting power text for ${powerId}: ${slot.totalKw || 0} kW`);
    $(powerId).removeClass("alertDanger alertSuccess").addClass(
        totalKw > powerLimit ? "alertDanger" : "alertSuccess"
    );

} else {
    $(`.${source}.single-phase`).show();

    const Kw = parseFloat(slot.Kw) || 0;

    const rows = $(`.${source}.single-phase`);
    
    // Kw
    rows.eq(0).find("td").eq(1)
        .text(slot.Kw || "0")
        .removeClass("alertDanger alertSuccess")
        .addClass(Kw > powerLimit ? "alertDanger" : "alertSuccess");

    rows.eq(1).find("td").eq(1)
    .text(slot.Kwh || "0")
    .removeClass("alertDanger alertSuccess")
    .addClass((parseFloat(slot.Kwh) || 0) > powerLimit ? "alertDanger" : "alertSuccess");


    $(powerId).text(`${slot.Kw || 0} kW`);
    $(powerId).removeClass("alertDanger alertSuccess").addClass(
        Kw > powerLimit ? "alertDanger" : "alertSuccess"
    );
}

        });
    }

    // Update temperature alert statuses
    $("#highTemp").removeClass("alertDanger alertSuccess alertWarning").addClass(
        highTemp > setPoints.highLimit ? "alertDanger" :
        highTemp < setPoints.lowLimit ? "alertWarning" : "alertSuccess"
    );

    $("#midTemp").removeClass("alertDanger alertSuccess alertWarning").addClass(
        midTemp > setPoints.highLimit ? "alertDanger" :
        midTemp < setPoints.lowLimit ? "alertWarning" : "alertSuccess"
    );

    $("#lowTemp").removeClass("alertDanger alertSuccess alertWarning").addClass(
        lowTemp > setPoints.highLimit ? "alertDanger" :
        lowTemp < setPoints.lowLimit ? "alertWarning" : "alertSuccess"
    );

    $("#midTempRh").removeClass("alertDanger alertSuccess alertWarning").addClass(
        midTempRh > setPoints.highLimit ? "alertDanger" :
        midTempRh < setPoints.lowLimit ? "alertWarning" : "alertSuccess"
    );
}

        function updateSelectionCounters(sc) {
  try {
    // First ensure sc is valid and has the find method
    if (!sc || typeof sc.find !== 'function') {
      console.error('Invalid seatCharts instance');
      return;
    }

    // Get selected seats - handle cases where it might not be an array
    const selected = sc.find('selected');
    const selectedArray = Array.isArray(selected) ? selected : [];

    // Safely calculate counts
    const count = selectedArray.length;
    const total = selectedArray.reduce((sum, seat) => {
      // Ensure seat.data() exists and has price property
      const price = seat && seat.data && seat.data().price;
      return sum + (typeof price === 'number' ? price : 0);
    }, 0);

    // Update UI elements
    if ($counter && $counter.length) $counter.text(count);
    if ($total && $total.length) $total.text(total);
  } catch (err) {
    console.error('Error in updateSelectionCounters:', err);
  }
}
        return {
            initialize: initializeUI,
            createDynamicSelectors,
            updateServers: () => $('#servers').trigger('change'),
            updateSeatMap,
            powerStatus,  // Expose these functions
        tempStatus,
        fetchSetPoints,
        updateLegendWithSetPoints 
        };
    })();
$(document).ready(function() {
    console.log('[DEBUG] Document ready - initialization started');

    function onViewModeChange(viewMode, hallNumber) {
        if (viewMode === VIEW_MODES.POWER) {
            UIManager.powerStatus(hallNumber);
        } else if (viewMode === VIEW_MODES.TEMPERATURE) {
            UIManager.tempStatus(hallNumber);
        }
        // Update legend whenever view mode changes
        const serverHallCode = `SVR${String(hallNumber).padStart(2, '0')}`;
        UIManager.updateLegendWithSetPoints(serverHallCode);
    }

    $('#dataTab').on('change', function () {
        const selectedValue = $(this).val();
        if (selectedValue === 'powerStatusLink') {
            setViewMode(VIEW_MODES.POWER);
            const match = $('#servers').val().match(/\d+/);
            const hallNumber = match ? match[0] : "00";
            onViewModeChange(VIEW_MODES.POWER, hallNumber);
        } else if (selectedValue === 'tempStatusLink') {
            setViewMode(VIEW_MODES.TEMPERATURE);
            const match = $('#servers').val().match(/\d+/);
            const hallNumber = match ? match[0] : "00";
            onViewModeChange(VIEW_MODES.TEMPERATURE, hallNumber);
        }
    });

    $('.tempbtn').click(function(e) {
        e.preventDefault();
        setViewMode(VIEW_MODES.TEMPERATURE);
        $('#dataTab').val('tempStatusLink');
        const match = $('#servers').val().match(/\d+/);
        const hallNumber = match ? match[0] : "00";
        onViewModeChange(VIEW_MODES.TEMPERATURE, hallNumber);
    });

    $('.powerbtn').click(function(e) {
        e.preventDefault();
        setViewMode(VIEW_MODES.POWER);
        $('#dataTab').val('powerStatusLink');
        const match = $('#servers').val().match(/\d+/);
        const hallNumber = match ? match[0] : "00";
        onViewModeChange(VIEW_MODES.POWER, hallNumber);
    });

    UIManager.initialize();

    DataService.getRackData().then(function(data) {
        if (data.length === 0) {
            console.warn('No rack data found.');
            $('#seat-map').html('<div class="alert alert-warning">No rack data available</div>');
        } else {
            console.log('Successfully loaded', data.length, 'rack entries');
            UIManager.createDynamicSelectors(DataService.getServerHalls());

            const floors = [...new Set(data.map(item => item.floor))].sort();
            $('#floors').empty().append(floors.map(f => 
                `<option value="${f}">Floor ${f}</option>`
            ));

            if (floors.length > 0) {
                $('#floors').val(floors[0]).trigger('change');
                // Update legend when initial floor is selected
                const initialHall = $('#servers').val();
                const match = initialHall ? initialHall.match(/\d+/) : null;
                const hallNumber = match ? match[0] : "00";
                const serverHallCode = `SVR${String(hallNumber).padStart(2, '0')}`;
                UIManager.updateLegendWithSetPoints(serverHallCode);
            }

            // Set initial view mode
            setViewMode(VIEW_MODES.POWER);
            const initialHall = $('#servers').val();
            const match = initialHall ? initialHall.match(/\d+/) : null;
            const hallNumber = match ? match[0] : "00";
            onViewModeChange(VIEW_MODES.POWER, hallNumber);
        }
    });

    // Also update legend when server hall changes
    $('#servers').on('change', function() {
        const selectedHall = $(this).val();
        if (selectedHall) {
            const match = selectedHall.match(/\d+/);
            const hallNumber = match ? match[0] : "00";
            const serverHallCode = `SVR${String(hallNumber).padStart(2, '0')}`;
            UIManager.updateLegendWithSetPoints(serverHallCode);
        }
    });
});

      })
      .fail(function(err) {
        console.error('Failed to load SeatCharts', err);
      });
   
 });