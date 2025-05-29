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

    // Enhanced data parsing
    function parseObixValue(rawValue) {
        if (rawValue === null || rawValue === undefined) return null;
        
        if (typeof rawValue === 'boolean') return rawValue;
        
        if (typeof rawValue === 'string') {
            const numMatch = rawValue.match(/[-+]?\d*\.?\d+/);
            if (numMatch) return parseFloat(numMatch[0]);
            
            if (rawValue.toLowerCase() === 'true') return true;
            if (rawValue.toLowerCase() === 'false') return false;
            
            return null;
        }
        
        if (typeof rawValue === 'number') return rawValue;
        
        return null;
    }
    

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
    
    // function getServerHallAndFloorFromOrd(ordPath) {
    //   try {
    //     const parts = ordPath.split('/');
    //     const hallPart = parts.find(p => p.match(/SVR(\d+)_J\d+/i));
    //     if (!hallPart) return null;
        
    //     const hallMatch = hallPart.match(/SVR(\d+)_J(\d+)/i);
    //     if (!hallMatch) return null;
        
    //     const hallNumber = parseInt(hallMatch[1], 10);
    //     const floorNumber = hallNumber <= 2 ? 1 : 2;
        
    //     return {
    //       serverHall: {
    //         displayName: `Server Hall ${hallNumber}`,
    //         code: `SVR${hallMatch[1]}`,
    //         value: hallNumber
    //       },
    //       floor: {
    //         displayName: `Floor ${floorNumber}`,
    //         value: floorNumber
    //       }
    //     };
    //   } catch (err) {
    //     console.warn('Error parsing server hall info:', err);
    //     return null;
    //   }
    // }
    
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

//     async function processOrdPaths(paths, serverHalls) {
//       const serverHallMap = new Map();
      
//       for (const path of paths) {
//         try {
//           const hallInfo = getServerHallAndFloorFromOrd(path);
//           if (!hallInfo || hallInfo.floor.value !== 1) { // Filter for floor 1 only
//             continue;
//           }
//           const parts = path.split('/');
//           const hallPart = parts.find(p => p.match(/SVR\d+/i));
//           const rackPart = parts.find(p => p.match(/(FF|SF)SH\d+/i));
          
//           if (!hallPart || !rackPart) continue;
          
//           const hallMatch = hallPart.match(/SVR(\d+)/i);
//           const rackMatch = rackPart.match(/^(FF|SF)SH(\d+)/i);
          
//           if (!hallMatch || !rackMatch) continue;
          
//           const serverHallNumber = parseInt(hallMatch[1]);
//           const floorPrefix = rackMatch[1].toUpperCase();
//           const floorId = floorPrefix === 'FF' ? 1 : 2;
          
//           const rackBase = rackPart.replace(/^(FF|SF)SH\d+/i, '');
          
//           const rackComponent = await baja.Ord.make(path).get();
//           console.log("rackcomponent " + rackComponent);
//           if (!rackComponent) continue;
          
//           const slots = rackComponent.getSlots()
//             .properties()
//             .isComponent()
//             .toArray();
          
//           if (!serverHallMap.has(serverHallNumber)) {
//             serverHallMap.set(serverHallNumber, {
//               id: serverHallNumber,
//               serverHall: `Server Hall ${serverHallNumber}`,
//               floor: floorId,
//               racks: []
//             });
//           }
          
//           const serverHallData = serverHallMap.get(serverHallNumber);
//           const rackSet = new Set(serverHallData.racks.map(r => r.rackname));
          
//           for (const slot of slots) {
//             try {
//               const path2 = `${path}/${slot}`;
              
//               console.log("path2 " + path2);
//               const rackComponent2 = await baja.Ord.make(path2).get();
//               console.log("rackcomponent2 " + rackComponent2);
//               if (!rackComponent) continue;
              
//               const slots2 = rackComponent2.getSlots()
//                 .properties()
//                 .isComponent()
//                 .toArray();
              
//               console.log("Slots fetched from path1:", slots2);
                
//               for(const slots of slots2){
//                 if (!rackComponent) continue;
//               const slotName = slot.getName();
//               if (slotName === 'SPARE') continue;
              
//               const slotMatch = slotName.match(/^([A-Za-z])(\d+)/i) || 
//                               slotName.match(/_([A-Za-z])(\d+)_/i);
//               if (!slotMatch) continue;
              
//               const slotLetter = slotMatch[1].toUpperCase();
//               const slotNumber = slotMatch[2];
              
//               let locationPrefix;
//               if (rackBase.startsWith('CGNW')) {
//                 locationPrefix = rackBase.slice(-1);
//               } else {
//                 const rackLetter = rackBase.charAt(0).toUpperCase();
//                 locationPrefix = String.fromCharCode(rackLetter.charCodeAt(0) + 2);
//               }
              
//               const rackName = rackBase.startsWith('CGNW') 
//                 ? `${rackBase} ${slotLetter}_${slotNumber.padStart(2, '0')}`
//                 : `${slotLetter}_${slotNumber.padStart(2, '0')}`;
//               console.log("rackName my test " + rackName);
              
//               const location = `${locationPrefix}_${slotNumber.padStart(2, '0')}`;
//               const location1 = `${locationPrefix}${slotNumber.padStart(2, '0')}`;
//               const path1 = `${path}/${location1}`;
//               console.log("path1" + path1);
             
              
//               if (!rackSet.has(rackName)) {
//                 serverHallData.racks.push({
//                   rackname: rackName,
//                   type: 'rack',
//                   location: location,
//                   fullPath: path1,
//                   slotName: slotName,
//                   isThreePhase: slotName.includes('_T')
//                 });
//                 rackSet.add(rackName);
//               }
//               }
//             } catch (err) {
//               console.warn('Error processing slot:', err);
//             }
//           }
//         } catch (err) {
//           console.warn('Error processing path:', err);
//         }
//       }
      
//     // Convert map values to array
// const serverHallArray = Array.from(serverHallMap.values());
// console.log("Unsorted Array:", serverHallArray);

// // Sort the array by `id`
// const sortedArray = serverHallArray.sort((a, b) => a.id - b.id);
// console.log("Sorted Array:", sortedArray);

// return sortedArray;

//     }
// async function processOrdPaths(paths, serverHalls) {
//   console.log("Starting processOrdPaths...");
//   const serverHallMap = new Map();
//   console.log("Initialized serverHallMap");
  
//   for (const path of paths) {
//     console.log("\nProcessing path:", path);
//     try {
//       const hallInfo = getServerHallAndFloorFromOrd(path);
//       console.log("Extracted hallInfo:", hallInfo);

//       if (!hallInfo || hallInfo.floor.value !== 1) {
//         console.log("Skipped (floor not 1 or hallInfo not found).");
//         continue;
//       }

//       const parts = path.split('/');
//       console.log("Split path into parts:", parts);

//       const hallPart = parts.find(p => p.match(/SVR\d+/i));
//       console.log("Found hallPart:", hallPart);

//       const rackPart = parts.find(p => p.match(/(FF|SF)SH\d+/i));
//       console.log("Found rackPart:", rackPart);

//       if (!hallPart || !rackPart) {
//         console.log("Missing hallPart or rackPart, skipping.");
//         continue;
//       }

//       const hallMatch = hallPart.match(/SVR(\d+)/i);
//       console.log("Parsed hallMatch:", hallMatch);

//       const rackMatch = rackPart.match(/^(FF|SF)SH(\d+)/i);
//       console.log("Parsed rackMatch:", rackMatch);

//       if (!hallMatch || !rackMatch) {
//         console.log("Invalid hallMatch or rackMatch, skipping.");
//         continue;
//       }

//       const serverHallNumber = parseInt(hallMatch[1]);
//       console.log("Parsed serverHallNumber:", serverHallNumber);

//       const floorPrefix = rackMatch[1].toUpperCase();
//       console.log("Parsed floorPrefix:", floorPrefix);

//       const floorId = floorPrefix === 'FF' ? 1 : 2;
//       console.log("Determined floorId:", floorId);

//       const rackBase = rackPart.replace(/^(FF|SF)SH\d+/i, '');
//       console.log("Extracted rackBase:", rackBase);

//       const rackComponent = await baja.Ord.make(path).get();
//       console.log("Fetched rackComponent:", rackComponent);

//       if (!rackComponent) {
//         console.log("rackComponent not found, skipping.");
//         continue;
//       }

//       // Function to recursively process slots and nested slots
//       async function processSlots(parentPath, parentComponent, depth = 0) {
//         const slots = parentComponent.getSlots().properties().isComponent().toArray();
//         console.log(`Found ${slots.length} slot(s) in ${parentPath} at depth ${depth}`);

//         const results = [];
        
//         for (const slot of slots) {
//           try {
//             const slotName = slot.getName();
//             console.log(`${'  '.repeat(depth)}Processing slot: ${slotName}`);

//             if (slotName === 'SPARE') {
//               console.log(`${'  '.repeat(depth)}Skipped SPARE slot`);
//               continue;
//             }

//             const slotPath = `${parentPath}/${slotName}`;
            
//             // Check if this slot has its own slots (nested)
//             const hasNestedSlots = slot.getSlots().properties().isComponent().toArray().length > 0;
            
//             if (hasNestedSlots) {
//               console.log(`${'  '.repeat(depth)}Found nested slots, processing recursively...`);
//               const nestedResults = await processSlots(slotPath, slot, depth + 1);
//               results.push(...nestedResults);
//             } else {
//               // Process regular slot
//               const slotMatch = slotName.match(/^([A-Za-z])(\d+)/i) || slotName.match(/_([A-Za-z])(\d+)_/i);
//               console.log(`${'  '.repeat(depth)}Matched slot pattern:`, slotMatch);

//               if (!slotMatch) {
//                 console.log(`${'  '.repeat(depth)}Slot name doesn't match expected format: ${slotName}`);
//                 continue;
//               }

//               const slotLetter = slotMatch[1].toUpperCase();
//               const slotNumber = slotMatch[2];
//               console.log(`${'  '.repeat(depth)}Extracted slotLetter: ${slotLetter}, slotNumber: ${slotNumber}`);

//               let locationPrefix;
//               if (rackBase.startsWith('CGNW')) {
//                 locationPrefix = rackBase.slice(-1);
//               } else {
//                 const rackLetter = rackBase.charAt(0).toUpperCase();
//                 locationPrefix = String.fromCharCode(rackLetter.charCodeAt(0) + 2);
//               }
//               console.log(`${'  '.repeat(depth)}Determined locationPrefix: ${locationPrefix}`);

//               const paddedSlotNumber = slotNumber.padStart(2, '0');
//               console.log(`${'  '.repeat(depth)}Padded slotNumber: ${paddedSlotNumber}`);

//               const rackName = rackBase.startsWith('CGNW')
//                 ? `${rackBase} ${slotLetter}_${paddedSlotNumber}`
//                 : `${slotLetter}_${paddedSlotNumber}`;
//               console.log(`${'  '.repeat(depth)}Generated rackName: ${rackName}`);

//               const location = `${locationPrefix}_${paddedSlotNumber}`;
//               const location1 = `${locationPrefix}${paddedSlotNumber}`;

//               results.push({
//                 slotPath: slotPath,
//                 slotName: slotName,
//                 rackName: rackName,
//                 location: location,
//                 isThreePhase: slotName.includes('_T')
//               });
//             }
//           } catch (err) {
//             console.warn(`${'  '.repeat(depth)}Error processing slot:`, err);
//           }
//         }
//         return results;
//       }

//       if (!serverHallMap.has(serverHallNumber)) {
//         serverHallMap.set(serverHallNumber, {
//           id: serverHallNumber,
//           serverHall: `Server Hall ${serverHallNumber}`,
//           floor: floorId,
//           racks: []
//         });
//         console.log("Created new entry in serverHallMap for Server Hall", serverHallNumber);
//       }

//       const serverHallData = serverHallMap.get(serverHallNumber);
//       console.log("Fetched serverHallData from map");

//       const rackSet = new Set(serverHallData.racks.map(r => r.rackname));
//       console.log("Initialized rackSet with current racknames");

//       // Process all slots (including nested ones)
//       const allSlots = await processSlots(path, rackComponent);
//       console.log(`Found ${allSlots.length} total slots (including nested)`);

//       for (const slotInfo of allSlots) {
//         if (!rackSet.has(slotInfo.rackName)) {
//           serverHallData.racks.push({
//             rackname: slotInfo.rackName,
//             type: 'rack',
//             location: slotInfo.location,
//             fullPath: slotInfo.slotPath,
//             slotName: slotInfo.slotName,
//             isThreePhase: slotInfo.isThreePhase
//           });
//           rackSet.add(slotInfo.rackName);
//           console.log("Added new rack to serverHallData:", slotInfo.rackName);
//         } else {
//           console.log("Rack already exists:", slotInfo.rackName);
//         }
//       }

//     } catch (err) {
//       console.warn('Error processing path:', err);
//     }
//   }

//   const serverHallArray = Array.from(serverHallMap.values());
//   console.log("\nUnsorted Array:", serverHallArray);

//   const sortedArray = serverHallArray.sort((a, b) => a.id - b.id);
//   console.log("Sorted Array:", sortedArray);

//   console.log("Returning final sorted array");
//   return sortedArray;
// }
//     async function processOrdPaths(paths, serverHalls) {
//       const serverHallMap = new Map();
      
//       for (const path of paths) {
//         try {
//           const hallInfo = getServerHallAndFloorFromOrd(path);
//           // if (!hallInfo || hallInfo.floor.value !== 1) { // Filter for floor 1 only
//           //   continue;
//           // }
//           const parts = path.split('/');
//           const hallPart = parts.find(p => p.match(/SVR\d+/i));
//           const rackPart = parts.find(p => p.match(/(FF|SF)SH\d+/i));
          
//           if (!hallPart || !rackPart) continue;
          
//           const hallMatch = hallPart.match(/SVR(\d+)/i);
//           const rackMatch = rackPart.match(/^(FF|SF)SH(\d+)/i);
          
//           if (!hallMatch || !rackMatch) continue;
          
//           const serverHallNumber = parseInt(hallMatch[1]);
//           const floorPrefix = rackMatch[1].toUpperCase();
//           const floorId = floorPrefix === 'FF' ? 1 : 2;
          
//           const rackBase = rackPart.replace(/^(FF|SF)SH\d+/i, '');
          
//           const rackComponent = await baja.Ord.make(path).get();
//           console.log("rackcomponent " + rackComponent);
//           if (!rackComponent) continue;
          
//           const slots = rackComponent.getSlots()
//             .properties()
//             .isComponent()
//             .toArray();
          
//           if (!serverHallMap.has(serverHallNumber)) {
//             serverHallMap.set(serverHallNumber, {
//               id: serverHallNumber,
//               serverHall: `Server Hall ${serverHallNumber}`,
//               floor: floorId,
//               racks: []
//             });
//           }
          
//           const serverHallData = serverHallMap.get(serverHallNumber);
//           const rackSet = new Set(serverHallData.racks.map(r => r.rackname));
          
//           for (const slot of slots) {
//             try {
//               const path2 = `${path}/${slot}`;
              
//               console.log("path2 " + path2);
//               const rackComponent2 = await baja.Ord.make(path2).get();
//               console.log("rackcomponent2 " + rackComponent2);
//               if (!rackComponent) continue;
              
//               const slots2 = rackComponent2.getSlots()
//                 .properties()
//                 .isComponent()
//                 .toArray();
              
//               console.log("Slots fetched from path1:", slots2);
                
//               for(const slots of slots2){
//                 if (!rackComponent) continue;
//               const slotName = slot.getName();
//               if (slotName === 'SPARE') continue;
              
//               const slotMatch = slotName.match(/^([A-Za-z])(\d+)/i) || 
//                               slotName.match(/_([A-Za-z])(\d+)_/i);
//               if (!slotMatch) continue;
              
//               const slotLetter = slotMatch[1].toUpperCase();
//               const slotNumber = slotMatch[2];
              
//               let locationPrefix;
//               if (rackBase.startsWith('CGNW')) {
//                 locationPrefix = rackBase.slice(-1);
//               } else {
//                 const rackLetter = rackBase.charAt(0).toUpperCase();
//                 locationPrefix = String.fromCharCode(rackLetter.charCodeAt(0) + 2);
//               }
              
//               const rackName = rackBase.startsWith('CGNW') 
//                 ? `${rackBase} ${slotLetter}_${slotNumber.padStart(2, '0')}`
//                 : `${slotLetter}_${slotNumber.padStart(2, '0')}`;
//               console.log("rackName my test " + rackName);
              
//               const location = `${locationPrefix}_${slotNumber.padStart(2, '0')}`;
//               const location1 = `${locationPrefix}${slotNumber.padStart(2, '0')}`;
//               const path1 = `${path}/${location1}`;
//               console.log("path1" + path1);
             
              
//               if (!rackSet.has(rackName)) {
//                 serverHallData.racks.push({
//                   rackname: rackName,
//                   type: 'rack',
//                   location: location,
//                   fullPath: path1,
//                   slotName: slotName,
//                   isThreePhase: slotName.includes('_T')
//                 });
//                 rackSet.add(rackName);
//               }
//               }
//             } catch (err) {
//               console.warn('Error processing slot:', err);
//             }
//           }
//         } catch (err) {
//           console.warn('Error processing path:', err);
//         }
//       }
      
//     // Convert map values to array
// const serverHallArray = Array.from(serverHallMap.values());
// console.log("Unsorted Array:", serverHallArray);

// // Sort the array by `id`
// const sortedArray = serverHallArray.sort((a, b) => a.id - b.id);
// console.log("Sorted Array:", sortedArray);

// return sortedArray;

//     }

// async function processOrdPaths(paths, serverHalls) {
//     const serverHallMap = new Map();
    
//     for (const path of paths) {
//         try {
//             const hallInfo = getServerHallAndFloorFromOrd(path);
//             if (!hallInfo) {
//                 console.warn('No hall info found for path:', path);
//                 continue;
//             }
            
//             const parts = path.split('/');
//             const hallPart = parts.find(p => p.match(/SVR\d+/i));
//             const rackPart = parts.find(p => p.match(/(FF|SF)SH\d+/i));
            
//             if (!hallPart || !rackPart) continue;
            
//             const hallMatch = hallPart.match(/SVR(\d+)/i);
//             const rackMatch = rackPart.match(/^(FF|SF)SH(\d+)([A-Z]?)/i);
            
//             if (!hallMatch || !rackMatch) continue;
            
//             const serverHallNumber = parseInt(hallMatch[1]);
//             const floorPrefix = rackMatch[1].toUpperCase();
//             const floorId = floorPrefix === 'FF' ? 1 : 2;
//             const rackLetter = rackMatch[3] || '';
            
//             // Get rack base name (everything after FFSH1/SFSH2 etc.)
//             const rackBase = rackPart.replace(/^(FF|SF)SH\d+/i, '');
//             console.log("paths " + path);
            
//             const rackComponent = await baja.Ord.make(path).get();
//             if (!rackComponent) continue;
            
//             if (!serverHallMap.has(serverHallNumber)) {
//                 serverHallMap.set(serverHallNumber, {
//                     id: serverHallNumber,
//                     serverHall: `Server Hall ${serverHallNumber}`,
//                     floor: floorId,
//                     racks: []
//                 });
//             }
            
//             const serverHallData = serverHallMap.get(serverHallNumber);
//             const rackSet = new Set(serverHallData.racks.map(r => r.rackname));
            
//             // Process all slots recursively
//             const slots = rackComponent.getSlots()
//                 .properties()
//                 .isComponent()
//                 .toArray();
            
//             for (const slot of slots) {
//                 try {
//                     const slotName = slot.getName();
//                     const path1 = `${path}/slotname`;
//                     console.log("path1 " + path1);
//                     const rackComponent2 = await baja.Ord.make(path1).get();
//                     const slots2 = rackComponent2.getSlots()
//                     .properties()
//                     .isComponent()
//                     .toArray();
//                     for(const slot1 of slots2){
//                       const slotName2 = slot.getName();
//                       return slotName2;
//                     }
                    
//                     if (slotName === 'SPARE') continue;
                    
//                     // Match slot patterns like A01 or A_01
//                     const slotMatch = slotName.match(/^([A-Za-z])(\d+)/i) || 
//                                     slotName.match(/_([A-Za-z])(\d+)/i);
//                     if (!slotMatch) continue;
                    
//                     const slotLetter = slotMatch[1].toUpperCase();
//                     const slotNumber = slotMatch[2];
                    
//                     // Determine location prefix based on rack base
//                     let locationPrefix;
//                     let rowLetter;
                    
//                     if (rackBase.startsWith('CGNW')) {
//                         // Case: FFSH1CGNWA, FFSH2CGNWB, etc.
//                         // Row letter is the last character of CGNW (A, B, etc.)
//                         rowLetter = rackBase.slice(-1);
//                         locationPrefix = rowLetter;
//                     } else if (rackBase) {
//                         // Case: FFSH1A, FFSH2B, etc.
//                         // Convert rack letter to location prefix (A->C, B->D, etc.)
//                         const rackLetter = rackBase.charAt(0).toUpperCase();
//                         rowLetter = 'A'; // All these are considered row A
//                         locationPrefix = String.fromCharCode(rackLetter.charCodeAt(0) + 2);
//                     } else {
//                         // Default case
//                         rowLetter = slotLetter;
//                         locationPrefix = slotLetter;
//                     }
                    
//                     // Format rack name and location
//                     const rackName = rackBase.startsWith('CGNW') 
//                         ? `${rackBase} ${slotLetter}_${slotNumber.padStart(2, '0')}`
//                         : `${rowLetter}_${slotNumber.padStart(2, '0')}`;
                    
//                     const location = `${locationPrefix}_${slotNumber.padStart(2, '0')}`;
//                     const fullPath = `${path}/${slotName}`;
                    
                    
//                     if (!rackSet.has(rackName)) {
//                         serverHallData.racks.push({
//                             rackname: rackName,
//                             type: 'rack',
//                             location: location,
//                             fullPath: fullPath,
//                             slotName: slotName2,
//                             isThreePhase: slotName.includes('_T')
//                         });
//                         rackSet.add(rackName);
//                     }
//                 } catch (err) {
//                     console.warn('Error processing slot:', err);
//                 }
//             }
//         } catch (err) {
//             console.warn('Error processing path:', err);
//         }
//     }
    
//     // Convert map to sorted array
//     const serverHallArray = Array.from(serverHallMap.values())
//         .sort((a, b) => a.id - b.id);
    
//     console.log('Processed server halls:', serverHallArray);
//     return serverHallArray;
// }

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

    // async function fetchRackData(ordPath, slotName) {
    //   try {
    //     console.log(`[DEBUG] fetchRackData called with ordPath: ${ordPath}, slotName: ${slotName}`);

    //     const pathWithoutPrefix = ordPath.replace(/^station:\|slot:/, '').replace(/^\//, '');
    //     const parts = pathWithoutPrefix.split('/').filter(Boolean);

    //     const rackId = parts[parts.length - 1];
    //     const basePath = 'station:|slot:/' + parts.slice(0, -1).join('/');
    //     const location = getRackLocationFromId(slotName);
    //     const rackName = getRackNameFromId(slotName);
    //     const isThreePhase = slotName.includes('_T');
        
    //     // Use DataService's exposed function
    //     const serverHallInfo = dataService.getServerHallAndFloorFromOrd(ordPath);
    //     const serverHall = serverHallInfo ? serverHallInfo.serverHall.displayName : 'Unknown';

    //     const rackData = {
    //       location: location,
    //       rackName: rackName,
    //       ordPath: basePath,
    //       isThreePhase: isThreePhase,
    //       source: slotName.includes('S1') ? 'Source 1' : 'Source 2',
    //       serverHall: serverHall,
    //       highTemp: null,
    //       lowTemp: null,
    //       midTemp: null,
    //       humidity: null,
    //       status: 'Offline',
    //       totalKw: null,
    //       kwh: null
    //     };

    //     if (isThreePhase) {
    //       rackData.redPhaseKw = null;
    //       rackData.yellowPhaseKw = null;
    //       rackData.bluePhaseKw = null;
    //     }

    //     const commonPoints = [
    //       { key: 'highTemp', path: 'highTemp' },
    //       { key: 'lowTemp', path: 'lowTemp' },
    //       { key: 'midTemp', path: 'midTemp' },
    //       { key: 'humidity', path: 'midTempRh' },
    //       { key: 'status', path: 'onnOffStatus' },
    //       { key: 'Kw', path: 'Kw' },
    //       { key: 'kwh', path: 'kwh' }
    //     ];

    //     const threePhasePoints = [
    //       { key: 'redPhaseKw', path: 'RKw' },
    //       { key: 'yellowPhaseKw', path: 'YKw' },
    //       { key: 'bluePhaseKw', path: 'BKw' },
    //       { key: 'totalKw', path: 'totalKw' },
    //       { key: 'kwh', path: 'kwh' }
    //     ];

    //     const measurementPoints = isThreePhase
    //       ? [...commonPoints, ...threePhasePoints]
    //       : commonPoints;

    //     // for (const { key, path } of measurementPoints) {
    //     //   const pointPath = `${basePath}/${slotName}/${path}`;
    //     //   console.log("pointPath" + pointPath);
    //     //   try {
    //     //     const value = await fetchPointValue(pointPath);
    //     //     if (value !== null && value !== undefined) {
    //     //       rackData[key] = key === 'status' ? (value ? 'Online' : 'Offline') : value;
    //     //     }
    //     //   } catch (error) {
    //     //     if (!error.message.includes("Slot doesn't exist")) {
    //     //       console.warn(`Error fetching ${pointPath}:`, error);
    //     //     }
    //     //   }
    //     // }
        
    //     for (const { key, path } of measurementPoints) {
    //                 const pointPath = `${basePath}/${slotName}/${path}`;
    //                 try {
    //                     // Use throttled version instead of direct fetch
    //                     const value = await throttledFetchPointValue(pointPath);
    //                     if (value !== null && value !== undefined) {
    //                         rackData[key] = key === 'status' ? (value ? 'Online' : 'Offline') : value;
    //                     }
    //                 } catch (error) {
    //                     if (!error.message.includes("Slot doesn't exist")) {
    //                         console.warn(`Error fetching ${pointPath}:`, error);
    //                     }
    //                 }
    //             }
    //     console.log("rackData:", JSON.stringify(rackData, null, 2));

    //     return rackData;

    //   } catch (error) {
    //     console.error(`Error processing rack ${ordPath}:`, error);
    //     return null;
    //   }
    // }
    // Define point types at the top of your RackService
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
//     async function fetchRackData(ordPath, slotName) {
//   try {
//     console.log("ord path " + ordPath);
//     const pathWithoutPrefix = ordPath.replace(/^station:\|slot:/, '').replace(/^\//, '');
//     const parts = pathWithoutPrefix.split('/').filter(Boolean);
//     const rackId = parts[parts.length - 1];
//     const basePath = 'station:|slot:/' + parts.slice(0, -1).join('/');
//     const location = getRackLocationFromId(slotName);
//     const rackName = getRackNameFromId(slotName);
//     console.log("rack names  " + rackName);
//     const isThreePhase = slotName.includes('_T');

//     // Get server hall info
//     const serverHallInfo = dataService.getServerHallAndFloorFromOrd(ordPath);
//     const serverHall = serverHallInfo ? serverHallInfo.serverHall.displayName : 'Unknown';

//     // Initialize rack data structure
//     const rackData = {
//       location: location,
//       rackName: rackName,
//       ordPath: basePath,
//       isThreePhase: isThreePhase,
//       source: slotName.includes('S1') ? 'Source 1' : 'Source 2',
//       serverHall: serverHall,
//       highTemp: null,
//       lowTemp: null,
//       midTemp: null,
//       humidity: null,
//       status: 'Offline'
//     };

//     // Add phase-specific fields if three-phase
//     if (isThreePhase) {
//       rackData.redPhaseKw = null;
//       rackData.yellowPhaseKw = null;
//       rackData.bluePhaseKw = null;
//       rackData.totalKw = null;
//     } else {
//       rackData.Kw = null;
//     }
//     rackData.kwh = null;

//     // Combine point types based on rack type
//     const measurementPoints = [
//       ...POINT_TYPES.COMMON,
//       ...(isThreePhase ? POINT_TYPES.THREE_PHASE : POINT_TYPES.SINGLE_PHASE)
//     ];

//     // Process all points with throttling
//     for (const { key, path } of measurementPoints) {
//       const pointPath = `${basePath}/${slotName}/${path}`;
//       try {
//         const value = await throttledFetchPointValue(pointPath);
//         if (value !== null && value !== undefined) {
//           rackData[key] = key === 'status' ? (value ? 'Online' : 'Offline') : value;
//         }
//       } catch (error) {
//         if (!error.message.includes("Slot doesn't exist")) {
//           console.warn(`Error fetching ${pointPath}:`, error);
//         }
//       }
//     }

//     console.log("rackData:", JSON.stringify(rackData, null, 2));
//     return rackData;

//   } catch (error) {
//     console.error(`Error processing rack ${ordPath}:`, error);
//     return null;
//   }
// }

// Modified fetchRackData function to handle slotNames array
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

// Helper functions
// function getRackLocationFromId(slotName) {
//   // Example: "A01_S1_T" -> "A_01"
//   const match = slotName.match(/^([A-Z])(\d+)/);
//   if (match) {
//     return `${match[1]}_${match[2].padStart(2, '0')}`;
//   }
//   return slotName;
// }

// function getRackNameFromId(slotName) {
//   // Example: "A01_S1_T" -> "A01"
//   const match = slotName.match(/^([A-Z]\d+)/);
//   return match ? match[1] : slotName;
// }

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

    // Original fetchPointValue function
    // async function fetchPointValue(ordPath) {
    //     try {
    //         const ord = baja.Ord.make(ordPath);
    //         console.log("fetchpointpath " + ord);
    //         if (!ord) {
    //             console.error(`Invalid ORD: ${ordPath}`);
    //             return null;
    //         }

    //         const point = await ord.get({ subscriber: sub });
    //         if (!point) {
    //             console.warn(`No valid object found at: ${ordPath}`);
    //             return null;
    //         }

    //         const displayValue = point.getDisplay();
    //         console.log("displayvalue" + displayValue);
    //         if (!displayValue) {
    //             console.warn(`No display value found at: ${ordPath}`);
    //             return null;
    //         }
            
    //         let modifiedValue;
    //         const bpoint = point.getTypeDisplayName();
    //         if (bpoint === "Boolean Writable") {
    //             modifiedValue = displayValue.replace(/^(true|false)(.+)?$/i, "$1");
    //         } else {
    //             modifiedValue = displayValue.replace(/(^\d+)(.+$)/i, "$1");
    //         }
    //         console.log("modified value " + modifiedValue);
    //         return modifiedValue;
    //     } catch (error) {
    //         console.error(`Error getting value from ${ordPath}:`, error);
    //         return null;
    //     }
    // }
    
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
    
    // async function fetchPointValue(ordPath) {
    //   try {
    //     const ord = baja.Ord.make(ordPath);
    //     console.log("fetchpointpath " + ord);
    //     if (!ord) {
    //       console.error(`Invalid ORD: ${ordPath}`);
    //       return null;
    //     }

    //     const point = await ord.get({ subscriber: sub });
    //     if (!point) {
    //       console.warn(`No valid object found at: ${ordPath}`);
    //       return null;
    //     }

    //     const displayValue = point.getDisplay();
    //     console.log("displayvalue" + displayValue);
    //     if (!displayValue) {
    //       console.warn(`No display value found at: ${ordPath}`);
    //       return null;
    //     }
        
    //     let modifiedValue;
    //     const bpoint = point.getTypeDisplayName();
    //     if (bpoint === "Boolean Writable") {
    //       modifiedValue = displayValue.replace(/^(true|false)(.+)?$/i, "$1");
    //     } else {
    //       modifiedValue = displayValue.replace(/(^\d+)(.+$)/i, "$1");
    //     }
    //     console.log("modified value " + modifiedValue);
    //     return modifiedValue;
    //   } catch (error) {
    //     console.error(`Error getting value from ${ordPath}:`, error);
    //     return null;
    //   }
    // }

    function getRackLocationFromId(rackId) {
      const match = rackId.match(/([A-Z])(\d+)/i);
      return match ? `${match[1]}_${match[2].padStart(2, '0')}` : rackId;
    }

    function getRackNameFromId(rackId) {
      const match = rackId.match(/([A-Z])(\d+)/i);
      return match ? `Rack ${match[1]}${match[2]}` : rackId;
    }
    
    // Helper functions
// function getRackLocationFromId(slotName) {
//   // Example: "A01_S1_T" -> "A_01"
//   const match = slotName.match(/^([A-Z])(\d+)/);
//   if (match) {
//     return `${match[1]}_${match[2].padStart(2, '0')}`;
//   }
//   return slotName;
// }

// function getRackNameFromId(slotName) {
//   // Example: "A01_S1_T" -> "A01"
//   const match = slotName.match(/^([A-Z]\d+)/);
//   return match ? match[1] : slotName;
// }

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


        // function initializeUI() {
        //     $counter = $('#counter');
        //     $total = $('#total');
        //     $cart = $('#selected-seats');
        //     setupEventHandlers();
        //     updateViewMode();
        // }
        
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

        // function setViewMode(mode) {
        //     currentViewMode = mode;
        //     window.location.hash = mode === VIEW_MODES.POWER ? 'powerSts' : 'tempSts';
        //     updateViewMode();
        // }

        // function updateViewMode() {
        //     const isPowerView = currentViewMode === VIEW_MODES.POWER;
        //     try {
        //         window.location.hash = isPowerView ? 'powerSts' : 'tempSts';
                
        //         $(".brdrBox.floor-details.tempSts").toggleClass("visible", !isPowerView);
        //         $(".brdrBox.floor-details.powerSts").toggleClass("visible", isPowerView);
        //         $("#legend").toggleClass("tempStatusLegend", !isPowerView);
        //         $("#legend").toggleClass("powerStatusLegend", isPowerView);
        //         $(".floorLayout").toggleClass("tempStatusSec", !isPowerView);
        //         $(".floorLayout").toggleClass("powerStatusSec", isPowerView);
        //     } catch (error) {
        //         console.error('[ERROR] Error handling view change:', error);
        //     }
        // }
        
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

//         async function handleSeatClick(sc) {
//             try {
//                 const rackId = this.settings.id;
//                 const [row, number] = rackId.split('_');
//                 const paddedNumber = number.padStart(2, '0');
//                 const paddedRackId = `${row}_${paddedNumber}`;

//                 const selectedServerHall = $('#servers').val();
//                 if (!selectedServerHall) {
//                     console.warn('No server hall selected');
//                     return 'available';
//                 }

//                 const hallData = DataService.getRacks().find(h => 
//                     h.serverHall === selectedServerHall
//                 );
//                 console.log("Matched Hall Data:", JSON.stringify(hallData, null, 2));

//                 if (!hallData) {
//                     console.warn(`No hall data for ${selectedServerHall}`);
//                     return 'available';
//                 }

//                 // Dynamic rack matching logic
//                 const rackInfo = hallData.racks.find(r => {
//     console.log("Checking rack:", r);

//     // Try matching by formattedLocation first (e.g., "A_01")
//     if (r.formattedLocation === paddedRackId) {
//         console.log("Match found with formattedLocation:", r.formattedLocation);
//         return true;
//     }

//     // Try matching by location (e.g., "A_01")
//     if (r.location === paddedRackId) {
//         console.log("Match found with location:", r.location);
//         return true;
//     }

//     // Try matching by rackname pattern (e.g., "CGNWA A_01")
//     const rackNameParts = r.rackname.split(' ');
//     if (rackNameParts.length > 1) {
//         const lastPart = rackNameParts[rackNameParts.length - 1];
//         console.log("Checking rackname last part:", lastPart);
//         if (lastPart === paddedRackId) {
//             console.log("Match found with rackname last part:", lastPart);
//             return true;
//         }
//     }

//     console.log("No match for rack:", r.rackname);
//     return false;
// });


//                 console.log("Matched rackInfo Data:", JSON.stringify(rackInfo, null, 2));

//                 if (!rackInfo) {
//                     console.warn(`No matching rack found for ${rackId} in ${selectedServerHall}`);
//                     return 'available';
//                 }

//                 const rackData = await RackService.fetchRackData(
//                     rackInfo.fullPath,
//                     rackInfo.slotNames || [],
//                     rackInfo
//                 );
//                 console.log("Matched rackData Data:", JSON.stringify(rackData, null, 2));

//                 if (!rackData) {
//                     console.warn(`No data for rack ${rackInfo.location}`);
//                     return 'available';
//                 }

//                 updateRackDetailsUI(rackData);
                

//                 if (this.status() === 'available') {
//                     const totalKw = rackData.totalKw ?? 0;
//                     $(`<li id="cart-item-${rackId}">${rackInfo.rackname}: ${totalKw} kW</li>`)
//                         .appendTo($cart);
//                     updateSelectionCounters(sc);
//                     return 'selected';
//                 } else {
//                     $(`#cart-item-${rackId}`).remove();
//                     updateSelectionCounters(sc);
//                     return 'available';
//                 }
//             } catch (err) {
//                 console.error('Seat click error:', err);
//                 return 'available';
//             }
//         }

// async function handleSeatClick(sc) {
//     try {
//         const rackId = this.settings.id;
//         const [row, number] = rackId.split('_');
//         const paddedNumber = number.padStart(2, '0');
//         const paddedRackId = `${row}_${paddedNumber}`;

//         const selectedServerHall = $('#servers').val();
//         console.log("selected server hall " + selectedServerHall);
//         if (!selectedServerHall) {
//             console.warn('No server hall selected');
//             return 'available';
//         }

//         const hallData = DataService.getRacks().find(h => 
//             h.serverHall === selectedServerHall
//         );

//         if (!hallData) {
//             console.warn(`No hall data for ${selectedServerHall}`);
//             return 'available';
//         }

//         // Find matching rack - now matching by location (A_01 format)
//         const rackInfo = hallData.racks.find(r => {
//             return r.location === paddedRackId || 
//                   r.rackname === paddedRackId ||
//                   r.rackname.endsWith(paddedRackId);
//         });
        
//         console.log("rackDataI", JSON.stringify(rackInfo, null, 2));

//         if (!rackInfo) {
//             console.warn(`No matching rack found for ${rackId} in ${selectedServerHall}`);
//             return 'available';
//         }

//         // Use the fullPath which now includes the A01 level
//         const rackData = await RackService.fetchRackData(
//           rackInfo.fullPath,
//           rackInfo.slotNames,
//           rackInfo.rackName // Pass the rackName here
//       );
        
//         console.log("rackDataf", JSON.stringify(rackData, null, 2));
//         if (!rackData) {
//             console.warn(`No data for rack ${rackInfo.location}`);
//             return 'available';
//         }
        
       
// const match = selectedServerHall.match(/\d+/); // Extracts the number part

// const hallNumber = match ? match[0].padStart(2, '0') : "00";
// console.log(hallNumber); // Output: "01"


//         updateRackDetailsUI(rackData, hallNumber);
//         powerStatus(serverHall);
//         tempStatus(serverHall);

//         if (this.status() === 'available') {
//             const totalKw = rackData.totalKw ?? 0;
//             $(`<li id="cart-item-${rackId}">${rackInfo.rackname}: ${totalKw} kW</li>`)
//                 .appendTo($cart);
//             updateSelectionCounters(sc);
//             return 'selected';
//         } else {
//             $(`#cart-item-${rackId}`).remove();
//             updateSelectionCounters(sc);
//             return 'available';
//         }
//     } catch (err) {
//         console.error('Seat click error:', err);
//         return 'available';
//     }
// }

// function updateRackDetailsUI(data) {
//     console.log("Data to display:", JSON.stringify(data, null, 2));

//     // Show all relevant sections
//     $(".rackProperty td").addClass("showCol");
//     console.log("Added .showCol to .rackProperty td");

//     $(".rackProperty#tempStats").addClass("showCol");
//     console.log("Added .showCol to #tempStats");

//     $(".rackProperty#powerStats").addClass("showCol");
//     console.log("Added .showCol to #powerStats");

//     $("a.btn.btn-primary.rackLink").addClass("showCol");
//     console.log("Added .showCol to rackLink");

//     // Update basic values using rack-level data
//     $('#highTempValue').text(data.highTemp ?? 'N/A');
//     console.log("High Temp:", data.highTemp);

//     $('#lowTempValue').text(data.lowTemp ?? 'N/A');
//     console.log("Low Temp:", data.lowTemp);

//     $('#midTempValue').text(data.midTemp ?? 'N/A');
//     console.log("Mid Temp:", data.midTemp);

//     $('#humidityValue').text(data.humidity ? `${data.humidity}%` : 'N/A');
//     console.log("Humidity:", data.humidity);

//     $('#totalKwValue').text(data.totalKw ?? 'N/A');
//     console.log("Total kW:", data.totalKw);

//     $('#kwhValue').text(data.kwh ?? 'N/A');
//     console.log("KWH:", data.kwh);

//     $('#statusValue').text(data.status);
//     console.log("Status:", data.status);

//     $('.rackName').text(data.rackName);
//     console.log("Rack Name:", data.rackName);

//     // Temperature and Humidity Display Logic
//     $("#temperatureValue1 a").html(`${data.highTemp ?? 'N/A'}°C`);
//     console.log("Set #temperatureValue1:", data.highTemp);

//     $("#temperatureValue2 a").html(`${data.midTemp ?? 'N/A'}°C`);
//     console.log("Set #temperatureValue2:", data.midTemp);

//     $("#temperatureValue3 a").html(`${data.lowTemp ?? 'N/A'}°C`);
//     console.log("Set #temperatureValue3:", data.lowTemp);

//     $("#humidityValue1").html(`${data.humidity ?? 'N/A'}%`);
//     $("#humidityValue2").html(`${data.humidity ?? 'N/A'}%`);
//     $("#humidityValue3").html(`${data.humidity ?? 'N/A'}%`);
//     console.log("Set humidity values to all 3 displays:", data.humidity);

//     // Power Display Logic
//     const powerValue = data.totalKw ? `${data.totalKw} kW` : 'N/A';
//     $("#powerValue a").html(powerValue);
//     $("#powerValue1 a").html(powerValue);
//     console.log("Set power values:", powerValue);

//     // Set alert classes for temperatures
//     const highTemp = parseFloat(data.highTemp) || 0;
//     const midTemp = parseFloat(data.midTemp) || 0;
//     const lowTemp = parseFloat(data.lowTemp) || 0;
//     const humidity = parseFloat(data.humidity) || 0;

//     console.log("Parsed Temps and Humidity:", { highTemp, midTemp, lowTemp, humidity });

//     $("#temperatureValue1 a").removeClass("alertDanger alertSuccess")
//         .addClass(highTemp > 28 ? "alertDanger" : "alertSuccess");
//     console.log("High temp alert:", highTemp > 28 ? "alertDanger" : "alertSuccess");

//     $("#temperatureValue2 a").removeClass("alertDanger alertSuccess")
//         .addClass(midTemp > 24 ? "alertDanger" : "alertSuccess");
//     console.log("Mid temp alert:", midTemp > 24 ? "alertDanger" : "alertSuccess");

//     $("#temperatureValue3 a").removeClass("alertDanger alertSuccess")
//         .addClass(lowTemp > 20 ? "alertDanger" : "alertSuccess");
//     console.log("Low temp alert:", lowTemp > 20 ? "alertDanger" : "alertSuccess");

//     $("#humidityValue1, #humidityValue2, #humidityValue3").removeClass("alertDanger alertSuccess")
//         .addClass(humidity < 20 || humidity > 60 ? "alertDanger" : "alertSuccess");
//     console.log("Humidity alert:", humidity < 20 || humidity > 60 ? "alertDanger" : "alertSuccess");

//     // Power alert classes
//     const power = parseFloat(data.totalKw) || 0;
//     $("#powerValue a, #powerValue1 a").removeClass("alertDanger alertWarning alertSuccess")
//         .addClass(
//             power > 1500 ? "alertDanger" :
//             power > 1000 ? "alertWarning" : "alertSuccess"
//         );
//     console.log("Power alert:", 
//         power > 1500 ? "alertDanger" :
//         power > 1000 ? "alertWarning" : "alertSuccess"
//     );

//     // Update status indicator
//     const isOnline = data.status === true || data.status === "true" || data.status?.toLowerCase() === "online";
//     $('#statusValue').removeClass("online offline")
//         .addClass(isOnline ? "online" : "offline")
//         .text(isOnline ? "Online" : "Offline");
//     console.log("Status indicator class set to:", isOnline ? "online" : "offline");

//     // Update slot information if available
//     if (data.slots && data.slots.length > 0) {
//         console.log("Processing slots data:", data.slots);
//         data.slots.forEach((slot, index) => {
//             const slotId = index + 1;
//             $(`#slot${slotId}Name`).text(slot.slotName);
//             $(`#slot${slotId}Source`).text(slot.source);
//             $(`#slot${slotId}Status`).text(slot.status)
//                 .removeClass("online offline")
//                 .addClass(slot.status?.toLowerCase() === "online" ? "online" : "offline");
            
//             if (slot.isThreePhase) {
//                 $(`#slot${slotId}Power`).text(`${slot.totalKw} kW (R:${slot.redPhaseKw} Y:${slot.yellowPhaseKw} B:${slot.bluePhaseKw})`);
//             } else {
//                 $(`#slot${slotId}Power`).text(`${slot.Kw ?? slot.totalKw} kW`);
//             }
//             $(`#slot${slotId}Energy`).text(`${slot.kwh} kWh`);
//         });
//     }
// }

// function updateRackDetailsUI(data) {
//     console.log("Data to display:", JSON.stringify(data, null, 2));

//     // Show all relevant sections
//     $(".rackProperty td").addClass("showCol");
//     console.log("Added .showCol to .rackProperty td");

//     $(".rackProperty#tempStats").addClass("showCol");
//     console.log("Added .showCol to #tempStats");

//     $(".rackProperty#powerStats").addClass("showCol");
//     console.log("Added .showCol to #powerStats");

//     $("a.btn.btn-primary.rackLink").addClass("showCol");
//     console.log("Added .showCol to rackLink");

//     // Update basic values using rack-level data
//     $('#highTempValue').text(data.highTemp ?? 'N/A');
//     console.log("High Temp:", data.highTemp);

//     $('#lowTempValue').text(data.lowTemp ?? 'N/A');
//     console.log("Low Temp:", data.lowTemp);

//     $('#midTempValue').text(data.midTemp ?? 'N/A');
//     console.log("Mid Temp:", data.midTemp);

//     $('#humidityValue').text(data.humidity ? `${data.humidity}%` : 'N/A');
//     console.log("Humidity:", data.humidity);

//     // Note: totalKw and kwh are at slot level in your data, not rack level
//     // So we'll calculate totals from slots if needed
//     const totalKw = data.slots.reduce((sum, slot) => sum + parseFloat(slot.totalKw || 0), 0);
//     const totalKwh = data.slots.reduce((sum, slot) => sum + parseFloat(slot.Kwh || 0), 0);
    
//     $('#totalKwValue').text(totalKw || 'N/A');
//     console.log("Total kW:", totalKw);

//     $('#kwhValue').text(totalKwh || 'N/A');
//     console.log("KWH:", totalKwh);

//     $('#statusValue').text(data.status);
//     console.log("Status:", data.status);

//     // Use the first slot's rackName if available, or serverHall as fallback
//     const displayRackName = data.slots && data.slots.length > 0 ? data.slots[0].rackName : data.serverHall;
//     $('.rackName').text(displayRackName);
//     console.log("Rack Name:", displayRackName);

//     // Temperature and Humidity Display Logic
//     $("#temperatureValue1 a").html(`${data.highTemp ?? 'N/A'}°C`);
//     console.log("Set #temperatureValue1:", data.highTemp);

//     $("#temperatureValue2 a").html(`${data.midTemp ?? 'N/A'}°C`);
//     console.log("Set #temperatureValue2:", data.midTemp);

//     $("#temperatureValue3 a").html(`${data.lowTemp ?? 'N/A'}°C`);
//     console.log("Set #temperatureValue3:", data.lowTemp);

//     $("#humidityValue1").html(`${data.midTempRh ?? 'N/A'}%`);
//     $("#humidityValue2").html(`${data.midTempRh ?? 'N/A'}%`);
//     $("#humidityValue3").html(`${data.midTempRh ?? 'N/A'}%`);
//     console.log("Set humidity values to all 3 displays:", data.midTempRh);

//     // Power Display Logic - using calculated total
//     const powerValue = totalKw ? `${totalKw} kW` : 'N/A';
//     $("#powerValue a").html(powerValue);
//     $("#powerValue1 a").html(powerValue);
//     console.log("Set power values:", powerValue);

//     // Set alert classes for temperatures
//     const highTemp = parseFloat(data.highTemp) || 0;
//     const midTemp = parseFloat(data.midTemp) || 0;
//     const lowTemp = parseFloat(data.lowTemp) || 0;
//     const humidity = parseFloat(data.humidity) || 0;

//     console.log("Parsed Temps and Humidity:", { highTemp, midTemp, lowTemp, humidity });

//     $("#temperatureValue1 a").removeClass("alertDanger alertSuccess")
//         .addClass(highTemp > 28 ? "alertDanger" : "alertSuccess");
//     console.log("High temp alert:", highTemp > 28 ? "alertDanger" : "alertSuccess");

//     $("#temperatureValue2 a").removeClass("alertDanger alertSuccess")
//         .addClass(midTemp > 24 ? "alertDanger" : "alertSuccess");
//     console.log("Mid temp alert:", midTemp > 24 ? "alertDanger" : "alertSuccess");

//     $("#temperatureValue3 a").removeClass("alertDanger alertSuccess")
//         .addClass(lowTemp > 20 ? "alertDanger" : "alertSuccess");
//     console.log("Low temp alert:", lowTemp > 20 ? "alertDanger" : "alertSuccess");

//     $("#humidityValue1, #humidityValue2, #humidityValue3").removeClass("alertDanger alertSuccess")
//         .addClass(humidity < 20 || humidity > 60 ? "alertDanger" : "alertSuccess");
//     console.log("Humidity alert:", humidity < 20 || humidity > 60 ? "alertDanger" : "alertSuccess");

//     // Power alert classes - using calculated total
//     $("#powerValue a, #powerValue1 a").removeClass("alertDanger alertWarning alertSuccess")
//         .addClass(
//             totalKw > 1500 ? "alertDanger" :
//             totalKw > 1000 ? "alertWarning" : "alertSuccess"
//         );
//     console.log("Power alert:", 
//         totalKw > 1500 ? "alertDanger" :
//         totalKw > 1000 ? "alertWarning" : "alertSuccess"
//     );

//     // Update status indicator
//     const isOnline = data.status === true || data.status === "true" || (data.status?.toLowerCase() === "online");
//     $('#statusValue').removeClass("online offline")
//         .addClass(isOnline ? "online" : "offline")
//         .text(isOnline ? "Online" : "Offline");
//     console.log("Status indicator class set to:", isOnline ? "online" : "offline");

//     // Update slot information if available
//     if (data.slots && data.slots.length > 0) {
//         console.log("Processing slots data:", data.slots);
//         data.slots.forEach((slot, index) => {
//             const slotId = index + 1;
//             $(`#slot${slotId}Name`).text(slot.slotName);
//             $(`#slot${slotId}Source`).text(slot.source);
            
//             // Assuming all slots have the same status as the rack
//             $(`#slot${slotId}Status`).text(isOnline ? "Online" : "Offline")
//                 .removeClass("online offline")
//                 .addClass(isOnline ? "online" : "offline");
            
//             if (slot.isThreePhase) {
//                 $(`#slot${slotId}Power`).text(`${slot.totalKw} kW (R:${slot.RKw} Y:${slot.YKw} B:${slot.BKw})`);
//             } else {
//                 $(`#slot${slotId}Power`).text(`${slot.totalKw} kW`);
//             }
//             $(`#slot${slotId}Energy`).text(`${slot.Kwh} kWh`);
//         });
//     }
// }

// function updateRackDetailsUI(data, hallNumber) {
//   const serverHallCode = `SVR${hallNumber}`;
// fetchSetPoints(serverHallCode).then(setPoints => {
//   $("#rackDetails").hide();
//                         $("#wholerack").show();
//                         $(".rackProperty td").addClass("showCol");
//                         $(".rackProperty#tempStats").addClass("showCol");
//                         $(".rackProperty#powerStats").addClass("showCol");
//                         $("a.btn.btn-primary.rackLink").addClass("showCol");
//     console.log("[DEBUG] Set points fetched:", setPoints);
//     $("#rackName").html(data.rackName);
//     $("#appliName").html(data.applName);
//     $("#aoName").html(data.aoName);
//     // Update basic values
//     $('#highTempValue').text(data.highTemp ?? 'N/A');
//     console.log("[DEBUG] High Temp Value:", data.highTemp);

//     $('#lowTempValue').text(data.lowTemp ?? 'N/A');
//     console.log("[DEBUG] Low Temp Value:", data.lowTemp);

//     $('#midTempValue').text(data.midTemp ?? 'N/A');
//     console.log("[DEBUG] Mid Temp Value:", data.midTemp);

//     $('#humidityValue').text(data.humidity ? `${data.humidity}%` : 'N/A');
//     console.log("[DEBUG] Humidity Value:", data.humidity);

//     // Parse temperature values
//     const highTemp = parseFloat(data.highTemp) || 0;
//     console.log("[DEBUG] Parsed High Temp:", highTemp);

//     const midTemp = parseFloat(data.midTemp) || 0;
//     console.log("[DEBUG] Parsed Mid Temp:", midTemp);

//     const lowTemp = parseFloat(data.lowTemp) || 0;
//     console.log("[DEBUG] Parsed Low Temp:", lowTemp);

//     const humidity = parseFloat(data.humidity) || 0;
//     console.log("[DEBUG] Parsed Humidity:", humidity);

//     // Temperature alert indicators
//     $("#temperatureValue1 a").removeClass("alertDanger alertSuccess")
//         .addClass(highTemp > setPoints.highLimit ? "alertDanger" : "alertSuccess");
//     console.log("[DEBUG] High Temp Alert Class:", highTemp > setPoints.highLimit ? "alertDanger" : "alertSuccess");

//     $("#temperatureValue2 a").removeClass("alertDanger alertSuccess")
//         .addClass(midTemp > setPoints.highLimit ? "alertDanger" : "alertSuccess");
//     console.log("[DEBUG] Mid Temp Alert Class:", midTemp > setPoints.highLimit ? "alertDanger" : "alertSuccess");

//     $("#temperatureValue3 a").removeClass("alertDanger alertSuccess")
//         .addClass(lowTemp > setPoints.highLimit ? "alertDanger" : "alertSuccess");
//     console.log("[DEBUG] Low Temp Alert Class:", lowTemp > setPoints.highLimit ? "alertDanger" : "alertSuccess");

//     // Add additional logic for low temperature alerts if needed
//     if (lowTemp < setPoints.lowLimit) {
//         $("#temperatureValue3 a").addClass("alertWarning");
//         console.log("[DEBUG] Low Temp is below limit, alertWarning added");
//     }

//     // Rest of the UI update logic...
// });

//     //     console.log("serverhallcode " + serverHallCode);
//     //     // Fetch set points for this server hall
//     //     const setPoints = fetchSetPoints(serverHallCode);
//     //     console.log("setPoints " + setPoints);
//     // console.log("Data to display:", JSON.stringify(data, null, 2));
//     // $("#rackDetails").hide();
//     //                     $("#wholerack").show();
//     //                     $(".rackProperty td").addClass("showCol");
//     //                     $(".rackProperty#tempStats").addClass("showCol");
//     //                     $(".rackProperty#powerStats").addClass("showCol");
//     //                     $("a.btn.btn-primary.rackLink").addClass("showCol");
                        
//     // $(".rackName").html(data.rackName);
   
//     // // Show all relevant sections
//     // $(".rackProperty td").addClass("showCol");
//     // console.log("Added .showCol to .rackProperty td");

//     // $(".rackProperty#tempStats").addClass("showCol");
//     // console.log("Added .showCol to #tempStats");

//     // $(".rackProperty#powerStats").addClass("showCol");
//     // console.log("Added .showCol to #powerStats");

//     // $("a.btn.btn-primary.rackLink").addClass("showCol");
//     // console.log("Added .showCol to rackLink");

//     // // Update basic values using rack-level data
//     // $('#highTempValue').text(data.highTemp ?? 'N/A');
//     // console.log("High Temp:", data.highTemp);

//     // $('#lowTempValue').text(data.lowTemp ?? 'N/A');
//     // console.log("Low Temp:", data.lowTemp);

//     // $('#midTempValue').text(data.midTemp ?? 'N/A');
//     // console.log("Mid Temp:", data.midTemp);

//     // $('#humidityValue').text(data.humidity ? `${data.humidity}%` : 'N/A');
//     // console.log("Humidity:", data.humidity);

//     // // Note: totalKw and kwh are at slot level in your data, not rack level
//     // // So we'll calculate totals from slots if needed
//     // const totalKw = data.slots.reduce((sum, slot) => sum + parseFloat(slot.totalKw || 0), 0);
//     // const totalKwh = data.slots.reduce((sum, slot) => sum + parseFloat(slot.Kwh || 0), 0);
    
//     // $('#totalKwValue').text(totalKw || 'N/A');
//     // console.log("Total kW:", totalKw);

//     // $('#kwhValue').text(totalKwh || 'N/A');
//     // console.log("KWH:", totalKwh);

//     // $('#statusValue').text(data.status);
//     // console.log("Status:", data.status);

//     // // Use the first slot's rackName if available, or serverHall as fallback
//     // const displayRackName = data.slots && data.slots.length > 0 ? data.slots[0].rackName : data.serverHall;
//     // $('.rackName').text(displayRackName);
//     // console.log("Rack Name:", displayRackName);

//     // // Temperature and Humidity Display Logic
//     // $("#temperatureValue1 a").html(`${data.highTemp ?? 'N/A'}°C`);
//     // console.log("Set #temperatureValue1:", data.highTemp);

//     // $("#temperatureValue2 a").html(`${data.midTemp ?? 'N/A'}°C`);
//     // console.log("Set #temperatureValue2:", data.midTemp);

//     // $("#temperatureValue3 a").html(`${data.lowTemp ?? 'N/A'}°C`);
//     // console.log("Set #temperatureValue3:", data.lowTemp);

//     // $("#humidityValue1").html(`${data.midTempRh ?? 'N/A'}%`);
//     // $("#humidityValue2").html(`${data.midTempRh ?? 'N/A'}%`);
//     // $("#humidityValue3").html(`${data.midTempRh ?? 'N/A'}%`);
//     // console.log("Set humidity values to all 3 displays:", data.midTempRh);

//     // // Power Display Logic - using calculated total
//     // const powerValue = totalKw ? `${totalKw} kW` : 'N/A';
//     // $("#powerValue a").html(powerValue);
//     // $("#powerValue1 a").html(powerValue);
//     // console.log("Set power values:", powerValue);

//     // // Set alert classes for temperatures
//     // const highTemp = parseFloat(data.highTemp) || 0;
//     // const midTemp = parseFloat(data.midTemp) || 0;
//     // const lowTemp = parseFloat(data.lowTemp) || 0;
//     // const humidity = parseFloat(data.humidity) || 0;

//     // console.log("Parsed Temps and Humidity:", { highTemp, midTemp, lowTemp, humidity });

//     // $("#temperatureValue1 a").removeClass("alertDanger alertSuccess")
//     //     .addClass(highTemp > 28 ? "alertDanger" : "alertSuccess");
//     // console.log("High temp alert:", highTemp > 28 ? "alertDanger" : "alertSuccess");

//     // $("#temperatureValue2 a").removeClass("alertDanger alertSuccess")
//     //     .addClass(midTemp > 24 ? "alertDanger" : "alertSuccess");
//     // console.log("Mid temp alert:", midTemp > 24 ? "alertDanger" : "alertSuccess");

//     // $("#temperatureValue3 a").removeClass("alertDanger alertSuccess")
//     //     .addClass(lowTemp > 20 ? "alertDanger" : "alertSuccess");
//     // console.log("Low temp alert:", lowTemp > 20 ? "alertDanger" : "alertSuccess");

//     // $("#humidityValue1, #humidityValue2, #humidityValue3").removeClass("alertDanger alertSuccess")
//     //     .addClass(humidity < 20 || humidity > 60 ? "alertDanger" : "alertSuccess");
//     // console.log("Humidity alert:", humidity < 20 || humidity > 60 ? "alertDanger" : "alertSuccess");

//     // // Power alert classes - using calculated total
//     // $("#powerValue a, #powerValue1 a").removeClass("alertDanger alertWarning alertSuccess")
//     //     .addClass(
//     //         totalKw > 1500 ? "alertDanger" :
//     //         totalKw > 1000 ? "alertWarning" : "alertSuccess"
//     //     );
//     // console.log("Power alert:", 
//     //     totalKw > 1500 ? "alertDanger" :
//     //     totalKw > 1000 ? "alertWarning" : "alertSuccess"
//     // );

//     // // Update status indicator
//     // const isOnline = data.status === true || data.status === "true" || (data.status?.toLowerCase() === "online");
//     // $('#statusValue').removeClass("online offline")
//     //     .addClass(isOnline ? "online" : "offline")
//     //     .text(isOnline ? "Online" : "Offline");
//     // console.log("Status indicator class set to:", isOnline ? "online" : "offline");

//     // // Update slot information if available
//     // if (data.slots && data.slots.length > 0) {
//     //     console.log("Processing slots data:", data.slots);
//     //     data.slots.forEach((slot, index) => {
//     //         const slotId = index + 1;
//     //         $(`#slot${slotId}Name`).text(slot.slotName);
//     //         $(`#slot${slotId}Source`).text(slot.source);
            
//     //         // Assuming all slots have the same status as the rack
//     //         $(`#slot${slotId}Status`).text(isOnline ? "Online" : "Offline")
//     //             .removeClass("online offline")
//     //             .addClass(isOnline ? "online" : "offline");
            
//     //         if (slot.isThreePhase) {
//     //             $(`#slot${slotId}Power`).text(`${slot.totalKw} kW (R:${slot.RKw} Y:${slot.YKw} B:${slot.BKw})`);
//     //         } else {
//     //             $(`#slot${slotId}Power`).text(`${slot.totalKw} kW`);
//     //         }
//     //         $(`#slot${slotId}Energy`).text(`${slot.Kwh} kWh`);
//     //     });
//     // }
// }

// function updateRackDetailsUI(data, hallNumber) {
//     const serverHallCode = `SVR${hallNumber}`;
    
//     fetchSetPoints(serverHallCode).then(setPoints => {
//         $("#rackDetails").hide();
//         $("#wholerack").show();
//         $(".rackProperty td").addClass("showCol");
//         $(".rackProperty#tempStats").addClass("showCol");
//         $(".rackProperty#powerStats").addClass("showCol");
//         $("a.btn.btn-primary.rackLink").addClass("showCol");

//         // Update basic information
//         $("#rackName").html(data.rackName);
//         $("#appliName").html(data.applName);
//         $("#aoName").html(data.aoName);

//         // Update temperature values
//         $('#highTempValue').text(data.highTemp ?? 'N/A');
//         $('#lowTempValue').text(data.lowTemp ?? 'N/A');
//         $('#midTempValue').text(data.midTemp ?? 'N/A');
//         $('#humidityValue').text(data.humidity ? `${data.humidity}%` : 'N/A');

//         // Parse temperature values for alerts
//         const highTemp = parseFloat(data.highTemp) || 0;
//         const midTemp = parseFloat(data.midTemp) || 0;
//         const lowTemp = parseFloat(data.lowTemp) || 0;
//         const humidity = parseFloat(data.humidity) || 0;

//         // Temperature alert indicators
//         $("#temperatureValue1 a").removeClass("alertDanger alertSuccess")
//             .addClass(highTemp > setPoints.highLimit ? "alertDanger" : "alertSuccess");
//         $("#temperatureValue2 a").removeClass("alertDanger alertSuccess")
//             .addClass(midTemp > setPoints.highLimit ? "alertDanger" : "alertSuccess");
//         $("#temperatureValue3 a").removeClass("alertDanger alertSuccess")
//             .addClass(lowTemp > setPoints.highLimit ? "alertDanger" : "alertSuccess");

//         if (lowTemp < setPoints.lowLimit) {
//             $("#temperatureValue3 a").addClass("alertWarning");
//         }

//         // Process power sources
//         if (data.slots && data.slots.length > 0) {
//             // First, hide all power-related rows
//             $("#rkw, #ykw, #bkw, #tkw, #kwh, #kw, #kwh2").parent().hide();
            
//             data.slots.forEach((slot, index) => {
//                 const sourceNum = index + 1;
//                 const isThreePhase = slot.isThreePhase;
                
//                 // Update the main power value for this source
//                 $(`#powerValue${sourceNum > 1 ? sourceNum : ''} a`).text(
//                     isThreePhase ? `${slot.totalKw} kW` : `${slot.Kw} kW`
//                 );
                
//                 if (isThreePhase) {
//                     // Show three-phase rows for this source
//                     if (sourceNum === 1) {
//                         $("#rkw").parent().show().next().text(slot.RKw || '0');
//                         $("#ykw").parent().show().next().text(slot.YKw || '0');
//                         $("#bkw").parent().show().next().text(slot.BKw || '0');
//                         $("#tkw").parent().show().next().text(slot.totalKw || '0');
//                         $("#kwh").parent().show().next().text(slot.Kwh || '0');
//                     } else {
//                         // For source 2, we don't have separate rows in your HTML for three-phase
//                         // So we'll just show the total and kWh
//                         $("#kw").parent().show().next().text(slot.totalKw || '0');
//                         $("#kwh2").parent().show().next().text(slot.Kwh || '0');
//                     }
//                 } else {
//                     // Show single-phase rows for this source
//                     if (sourceNum === 1) {
//                         $("#kw").parent().show().next().text(slot.Kw || '0');
//                         $("#kwh").parent().show().next().text(slot.Kwh || '0');
//                     } else {
//                         $("#kw").parent().show().next().text(slot.Kw || '0');
//                         $("#kwh2").parent().show().next().text(slot.Kwh || '0');
//                     }
//                 }
                
//                 // Set power alert classes
//                 const powerValue = parseFloat(isThreePhase ? slot.totalKw : slot.Kw) || 0;
//                 $(`#powerValue${sourceNum > 1 ? sourceNum : ''} a`)
//                     .removeClass("alertDanger alertWarning alertSuccess")
//                     .addClass(
//                         powerValue > 1500 ? "alertDanger" :
//                         powerValue > 1000 ? "alertWarning" : "alertSuccess"
//                     );
//             });
//         }

//         // Update status indicator
//         const isOnline = data.status === true || data.status === "true" || 
//                         (typeof data.status === 'string' && data.status.toLowerCase() === "online");
//         $('#statusValue').removeClass("online offline")
//             .addClass(isOnline ? "online" : "offline")
//             .text(isOnline ? "Online" : "Offline");
//     });
// }

// function updateRackDetailsUI(data, hallNumber) {
//     const serverHallCode = `SVR${hallNumber}`;
// $("#rackDetails").hide();
//         $("#wholerack").show();
//         $(".rackProperty td").addClass("showCol");
//         $(".rackProperty#tempStats").addClass("showCol");
//         $(".rackProperty#powerStats").addClass("showCol");
//         $("a.btn.btn-primary.rackLink").addClass("showCol");

//         // Update rack info
//         $("#rackName").html(data.rackName);
//         $("#appliName").html(data.applName);
//         $("#aoName").html(data.aoName);

//         // Update temperature
//         $('#highTemp').text(data.highTemp ?? 'N/A');
//         $('#lowTemp').text(data.lowTemp ?? 'N/A');
//         $('#midTemp').text(data.midTemp ?? 'N/A');
//         $('#midTempRh').text(data.humidity ? `${data.humidity}%` : 'N/A');

//         const highTemp = parseFloat(data.highTemp) || 0;
//         const midTemp = parseFloat(data.midTemp) || 0;
//         const lowTemp = parseFloat(data.lowTemp) || 0;
//         const midTempRh = parseFloat(data.humidity) || 0;
        
//         $(".three-phase, .single-phase").hide();

//         data.slots.forEach((slot, idx) => {
//             const source = slot.source === "Source 1" ? "source1" : "source2";
//             const powerId = source === "source1" ? "#powerValue" : "#powerValue1";

//             if (slot.isThreePhase) {
//                 $(`.${source}.three-phase`).show();
//                 $(`.${source}.three-phase`).eq(0).find("td").eq(1).text(slot.RKw || "0");
//                 $(`.${source}.three-phase`).eq(1).find("td").eq(1).text(slot.YKw || "0");
//                 $(`.${source}.three-phase`).eq(2).find("td").eq(1).text(slot.BKw || "0");
//                 $(`.${source}.three-phase`).eq(3).find("td").eq(1).text(slot.totalKw || "0");
//                 $(`.${source}.three-phase`).eq(4).find("td").eq(1).text(slot.Kwh || "0");

//                 // $(powerId + " a").text(`${slot.totalKw} kW`);

//                 // Alert class based on totalKw
//                 const powerVal = parseFloat(slot.totalKw) || 0;
//                 $(powerId + " a").removeClass("alertDanger alertSuccess").addClass(
//                     powerVal > setPoints.powerLimit ? "alertDanger" : "alertSuccess"
//                 );
//             } else {
//                 $(`.${source}.single-phase`).show();
//                 $(`.${source}.single-phase`).eq(0).find("td").eq(1).text(slot.Kw || "0");
//                 $(`.${source}.single-phase`).eq(1).find("td").eq(1).text(slot.Kwh || "0");

//                 // $(powerId + " a").text(`${slot.Kw} kW`);

//                 // Alert class based on Kw
//                 const powerVal = parseFloat(slot.Kw) || 0;
//                 $(powerId + " a").removeClass("alertDanger alertSuccess").addClass(
//                     powerVal > setPoints.powerLimit ? "alertDanger" : "alertSuccess"
//                 );
//             }
//         });
// //     fetchSetPoints(serverHallCode).then(setPoints => {
        

// //         // High Temp
// // $("#highTemp").removeClass("alertDanger alertSuccess alertWarning").addClass(
// //     highTemp > setPoints.highLimit
// //         ? "alertDanger"
// //         : highTemp < setPoints.lowLimit
// //             ? "alertWarning"
// //             : "alertSuccess"
// // );

// // // Mid Temp
// // $("#midTemp").removeClass("alertDanger alertSuccess alertWarning").addClass(
// //     midTemp > setPoints.highLimit
// //         ? "alertDanger"
// //         : midTemp < setPoints.lowLimit
// //             ? "alertWarning"
// //             : "alertSuccess"
// // );

// // // Low Temp
// // $("#lowTemp").removeClass("alertDanger alertSuccess alertWarning").addClass(
// //     lowTemp > setPoints.highLimit
// //         ? "alertDanger"
// //         : lowTemp < setPoints.lowLimit
// //             ? "alertWarning"
// //             : "alertSuccess"
// // );

// // // Mid Temp RH
// // $("#midTempRh").removeClass("alertDanger alertSuccess alertWarning").addClass(
// //     midTempRh > setPoints.highLimit
// //         ? "alertDanger"
// //         : midTempRh < setPoints.lowLimit
// //             ? "alertWarning"
// //             : "alertSuccess"
// // );


// //         // Hide all power rows initially
        
// //     });
// }
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

// function powerStatus(serverHall){
//   const serverHallCode = `SVR${hallNumber}`;
//   fetchSetPoints(serverHallCode).then(setPoints => {
        

//         // High Temp
// $("#highTemp").removeClass("alertDanger alertSuccess alertWarning").addClass(
//     highTemp > setPoints.highLimit
//         ? "alertDanger"
//         : highTemp < setPoints.lowLimit
//             ? "alertWarning"
//             : "alertSuccess"
// );

// // Mid Temp
// $("#midTemp").removeClass("alertDanger alertSuccess alertWarning").addClass(
//     midTemp > setPoints.highLimit
//         ? "alertDanger"
//         : midTemp < setPoints.lowLimit
//             ? "alertWarning"
//             : "alertSuccess"
// );

// // Low Temp
// $("#lowTemp").removeClass("alertDanger alertSuccess alertWarning").addClass(
//     lowTemp > setPoints.highLimit
//         ? "alertDanger"
//         : lowTemp < setPoints.lowLimit
//             ? "alertWarning"
//             : "alertSuccess"
// );

// // Mid Temp RH
// $("#midTempRh").removeClass("alertDanger alertSuccess alertWarning").addClass(
//     midTempRh > setPoints.highLimit
//         ? "alertDanger"
//         : midTempRh < setPoints.lowLimit
//             ? "alertWarning"
//             : "alertSuccess"
// );


//         // Hide all power rows initially
        
//     });
// }
// function tempStatus(serverHall){
//     const powerLimitHigh = 100;  // high threshold
//   const powerLimitLow = 10;    // low threshold (if needed)
  
//   // Power tables have multiple power values - let's iterate both sources and add alerts
  
//   ['powerValue', 'powerValue1'].forEach(id => {
//     const powerText = $(`#${id} a`).text().replace(/[^\d.]/g, '');
//     const powerVal = parseFloat(powerText) || 0;

//     $(`#${id} a`).removeClass("alertDanger alertWarning alertSuccess").addClass(
//       powerVal > powerLimitHigh ? "alertDanger" :
//       powerVal < powerLimitLow ? "alertWarning" :
//       "alertSuccess"
//     );
//   });
// }

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

  // // Main initialization
  // $(document).ready(function() {
  //   console.log('[DEBUG] Document ready - initialization started');
    
  //   // Initialize UI
  //   UIManager.initialize();
    
  //   // Load data and update UI
  //   DataService.getRackData().then(function(data) {
  //     if (data.length === 0) {
  //       console.warn('No rack data found.');
  //       $('#seat-map').html('<div class="alert alert-warning">No rack data available</div>');
  //     } else {
  //       console.log('Successfully loaded', data.length, 'rack entries');
  //       UIManager.createDynamicSelectors(DataService.getServerHalls());
        
  //       // Set default selection and initialize seat map
  //       $('#floors').val('1').trigger('change');
  //     }
  //   });

  //   // Handle hash-based initialization
  //   const hash = window.location.hash.substr(1);
  //   if (hash === "powerSts") {
  //     UIManager.setViewMode(VIEW_MODES.POWER);
  //   } else if (hash === "tempSts") {
  //     UIManager.setViewMode(VIEW_MODES.TEMPERATURE);
  //   }
  // });
//   $(document).ready(function() {
//     console.log('[DEBUG] Document ready - initialization started');
//     $('#dataTab').on('change', function () {
//     const selectedValue = $(this).val();
//     if (selectedValue === 'powerStatusLink') {
//         setViewMode(VIEW_MODES.POWER);
//     } else if (selectedValue === 'tempStatusLink') {
//         setViewMode(VIEW_MODES.TEMP);
//     }
// });

// $('.tempbtn').click(function(e) {
//     e.preventDefault(); // prevent default anchor jump
//     setViewMode(VIEW_MODES.TEMP);
//     $('#dataTab').val('tempStatusLink');
//   });

//   $('.powerbtn').click(function(e) {
//     e.preventDefault();
//     setViewMode(VIEW_MODES.POWER);
//     $('#dataTab').val('powerStatusLink');
//   });

//     UIManager.initialize();
    
//     DataService.getRackData().then(function(data) {
//         if (data.length === 0) {
//             console.warn('No rack data found.');
//             $('#seat-map').html('<div class="alert alert-warning">No rack data available</div>');
//         } else {
//             console.log('Successfully loaded', data.length, 'rack entries');
//             UIManager.createDynamicSelectors(DataService.getServerHalls());
            
//             // Initialize with all floors available
//             const floors = [...new Set(data.map(item => item.floor))].sort();
//             $('#floors').empty().append(floors.map(f => 
//                 `<option value="${f}">Floor ${f}</option>`
//             ));
            
//             // Select first available floor (could be 1 or 2)
//             if (floors.length > 0) {
//                 $('#floors').val(floors[0]).trigger('change');
//             }
//         }
//     });
// });
// First, define these functions before they're used


// Update the view mode change handlers
// $(document).ready(function() {
//     console.log('[DEBUG] Document ready - initialization started');

//     function onViewModeChange(viewMode, hallNumber) {
//         if (viewMode === VIEW_MODES.POWER) {
//             UIManager.powerStatus(hallNumber);
//         } else if (viewMode === VIEW_MODES.TEMPERATURE) {
//             UIManager.tempStatus(hallNumber);
//         }
//     }

//     $('#dataTab').on('change', function () {
//         const selectedValue = $(this).val();
//         if (selectedValue === 'powerStatusLink') {
//             setViewMode(VIEW_MODES.POWER);
//             const match = $('#servers').val().match(/\d+/);
//             const hallNumber = match ? match[0] : "00";
//             onViewModeChange(VIEW_MODES.POWER, hallNumber);
//         } else if (selectedValue === 'tempStatusLink') {
//             setViewMode(VIEW_MODES.TEMPERATURE);
//             const match = $('#servers').val().match(/\d+/);
//             const hallNumber = match ? match[0] : "00";
//             onViewModeChange(VIEW_MODES.TEMPERATURE, hallNumber);
//         }
//     });

//     $('.tempbtn').click(function(e) {
//         e.preventDefault();
//         setViewMode(VIEW_MODES.TEMPERATURE);
//         $('#dataTab').val('tempStatusLink');
//         const match = $('#servers').val().match(/\d+/);
//         const hallNumber = match ? match[0] : "00";
//         onViewModeChange(VIEW_MODES.TEMPERATURE, hallNumber);
//     });

//     $('.powerbtn').click(function(e) {
//         e.preventDefault();
//         setViewMode(VIEW_MODES.POWER);
//         $('#dataTab').val('powerStatusLink');
//         const match = $('#servers').val().match(/\d+/);
//         const hallNumber = match ? match[0] : "00";
//         onViewModeChange(VIEW_MODES.POWER, hallNumber);
//     });

//     UIManager.initialize();

//     DataService.getRackData().then(function(data) {
//         if (data.length === 0) {
//             console.warn('No rack data found.');
//             $('#seat-map').html('<div class="alert alert-warning">No rack data available</div>');
//         } else {
//             console.log('Successfully loaded', data.length, 'rack entries');
//             UIManager.createDynamicSelectors(DataService.getServerHalls());

//             const floors = [...new Set(data.map(item => item.floor))].sort();
//             $('#floors').empty().append(floors.map(f => 
//                 `<option value="${f}">Floor ${f}</option>`
//             ));

//             if (floors.length > 0) {
//                 $('#floors').val(floors[0]).trigger('change');
//             }

//             // Set initial view mode
//             setViewMode(VIEW_MODES.POWER);
//             const initialHall = $('#servers').val();
//             const match = initialHall ? initialHall.match(/\d+/) : null;
//             const hallNumber = match ? match[0] : "00";
//             onViewModeChange(VIEW_MODES.POWER, hallNumber);
//         }
//     });
// });
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