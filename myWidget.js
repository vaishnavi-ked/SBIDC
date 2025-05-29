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
            
            // Get rack base name (everything after FFSH1/SFSH2 etc.)
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
            const rackSet = new Set(serverHallData.racks.map(r => r.rackname));
            
            // Process all slots recursively
            const slots = rackComponent.getSlots()
                .properties()
                .isComponent()
                .toArray();
            
            for (const slot of slots) {
                try {
                    const slotName = slot.getName();
                    if (slotName === 'SPARE') continue;
                    
                    // Match slot patterns like A01 or A_01
                    const slotMatch = slotName.match(/^([A-Za-z])(\d+)/i) || 
                                    slotName.match(/_([A-Za-z])(\d+)/i);
                    if (!slotMatch) continue;
                    
                    const slotLetter = slotMatch[1].toUpperCase();
                    const slotNumber = slotMatch[2];
                    
                    // Determine location prefix based on rack base
                    let locationPrefix;
                    let rowLetter;
                    
                    if (rackBase.startsWith('CGNW')) {
                        // Case: FFSH1CGNWA, FFSH2CGNWB, etc.
                        // Row letter is the last character of CGNW (A, B, etc.)
                        rowLetter = rackBase.slice(-1);
                        locationPrefix = rowLetter;
                    } else if (rackBase) {
                        // Case: FFSH1A, FFSH2B, etc.
                        // Convert rack letter to location prefix (A->C, B->D, etc.)
                        const rackLetter = rackBase.charAt(0).toUpperCase();
                        rowLetter = 'A'; // All these are considered row A
                        locationPrefix = String.fromCharCode(rackLetter.charCodeAt(0) + 2);
                    } else {
                        // Default case
                        rowLetter = slotLetter;
                        locationPrefix = slotLetter;
                    }
                    
                    // Format rack name and location
                    const rackName = rackBase.startsWith('CGNW') 
                        ? `${rackBase} ${slotLetter}_${slotNumber.padStart(2, '0')}`
                        : `${rowLetter}_${slotNumber.padStart(2, '0')}`;
                    
                    const location = `${locationPrefix}_${slotNumber.padStart(2, '0')}`;
                    const fullPath = `${path}/${slotName}`;
                    
                    if (!rackSet.has(rackName)) {
                        serverHallData.racks.push({
                            rackname: rackName,
                            type: 'rack',
                            location: location,
                            fullPath: fullPath,
                            slotName: slotName,
                            isThreePhase: slotName.includes('_T')
                        });
                        rackSet.add(rackName);
                    }
                } catch (err) {
                    console.warn('Error processing slot:', err);
                }
            }
        } catch (err) {
            console.warn('Error processing path:', err);
        }
    }
    
    // Convert map to sorted array
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
    const sub = new baja.Subscriber();
    console.log("[INIT] RackService initialized with Subscriber:", sub);

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
    //       midTempRh: null,
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
    //       { key: 'midTempRh', path: 'midTempRh' },
    //       { key: 'status', path: 'onnOffStatus' },
    //       { key: 'totalKw', path: 'totalKw' },
    //       { key: 'kwh', path: 'kwh' }
    //     ];

    //     const threePhasePoints = [
    //       { key: 'redPhaseKw', path: 'RPHKw' },
    //       { key: 'yellowPhaseKw', path: 'YPHKw' },
    //       { key: 'bluePhaseKw', path: 'BPHKw' }
    //     ];

    //     const measurementPoints = isThreePhase
    //       ? [...commonPoints, ...threePhasePoints]
    //       : commonPoints;

    //     for (const { key, path } of measurementPoints) {
    //       const pointPath = `${basePath}/${slotName}/${path}`;
    //       console.log("pointPath" + pointPath);
    //       try {
    //         const value = await fetchPointValue(pointPath);
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
  async function fetchRackData(ordPath, slotName) {
  try {
    console.log(`[DEBUG] Processing rack: ${ordPath}, slot: ${slotName}`);

    // The ordPath should already include the A01 level (e.g., .../SFSH4CGNWA/A01)
    // So we don't need to add it again
    const basePath = ordPath.startsWith('station:|slot:') 
      ? ordPath 
      : `station:|slot:/${ordPath.replace(/^\//, '')}`;

    // Get location and rack info
    const location = getRackLocationFromId(slotName);
    const rackName = getRackNameFromId(slotName);
    const isThreePhase = slotName.includes('_T');
    
    // Get server hall info
    const serverHallInfo = dataService.getServerHallAndFloorFromOrd(ordPath);
    const serverHall = serverHallInfo ? serverHallInfo.serverHall.displayName : 'Unknown';

    // Initialize rack data structure
    const rackData = {
      ordPath: basePath,
      serverHall: serverHall,
      slots: [],
      highTemp: null,
      lowTemp: null,
      midTemp: null,
      midTempRh: null,
      status: 'Offline'
    };

    // Define points to fetch - using direct paths under the rack
    const points = [
      { key: 'highTemp', path: 'highTemp' },
      { key: 'lowTemp', path: 'lowTemp' },
      { key: 'midTemp', path: 'midTemp' },
      { key: 'midTempRh', path: 'midTempRh' },
      { key: 'totalKw', path: 'totalKw' },
      { key: 'kwh', path: 'kwh' }
    ];

    // Fetch all points
    for (const { key, path } of points) {
      const pointPath = `${basePath}/${path}`;
      try {
        const value = await fetchPointValue(pointPath);
        if (value !== null && value !== undefined) {
          rackData[key] = value;
          rackData.status = 'Online';
        }
      } catch (error) {
        console.warn(`Error fetching ${pointPath}:`, error.message);
      }
    }

    console.log("Final rackData:", JSON.stringify(rackData, null, 2));
    return rackData;

  } catch (error) {
    console.error(`Error processing rack ${ordPath}:`, error);
    return null;
  }
}
    
//     async function fetchRackData(ordPath, slotName) {
//   try {
//     console.log(`[DEBUG] fetchRackData called with ordPath: ${ordPath}, slotName: ${slotName}`);

//     // Don't remove the last segment - we need the full path including FFSH1CGNWA
//     const basePath = ordPath.startsWith('station:|slot:') 
//       ? ordPath 
//       : `station:|slot:/${ordPath.replace(/^\//, '')}`;
    
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
//       midTempRh: null,
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
//       { key: 'midTempRh', path: 'midTempRh' },
//       { key: 'status', path: 'onnOffStatus' },
//       { key: 'totalKw', path: 'totalKw' },
//       { key: 'kwh', path: 'kwh' }
//     ];

//     const threePhasePoints = [
//       { key: 'redPhaseKw', path: 'RPHKw' },
//       { key: 'yellowPhaseKw', path: 'YPHKw' },
//       { key: 'bluePhaseKw', path: 'BPHKw' }
//     ];

//     const measurementPoints = isThreePhase
//       ? [...commonPoints, ...threePhasePoints]
//       : commonPoints;

//     for (const { key, path } of measurementPoints) {
//       const pointPath = `${basePath}/${slotName}/${path}`;
//       console.log("Attempting to fetch pointPath:", pointPath);
//       try {
//         const value = await fetchPointValue(pointPath);
//         if (value !== null && value !== undefined) {
//           rackData[key] = key === 'status' ? (value ? 'Online' : 'Offline') : value;
//         }
//       } catch (error) {
//         if (!error.message.includes("Slot doesn't exist")) {
//           console.warn(`Error fetching ${pointPath}:`, error);
//         }
//       }
//     }
//     console.log("Final rackData:", JSON.stringify(rackData, null, 2));

//     return rackData;

//   } catch (error) {
//     console.error(`Error processing rack ${ordPath}:`, error);
//     return null;
//   }
// }

// async function fetchRackData(ordPath, slotName) {
//   try {
//     console.log(`[DEBUG] fetchRackData called with ordPath: ${ordPath}, slotName: ${slotName}`);

//     // The ordPath now already includes the A01 level
//     let basePath = ordPath.startsWith('station:|slot:')
//     ? ordPath
//     : `station:|slot:/${ordPath.replace(/^\//, '')}`;

//   // Extract rack part, e.g., FFSH1A or SFSH3A
//   // Matches /FFSH<number><letter>/ or /SFSH<number><letter>/
//   const rackMatch = basePath.match(/\/(FFSH|SFSH)(\d+)([A-Z])\//i);
//   if (!rackMatch) return basePath; // no rack info, return as is

//   const prefix = rackMatch[1];    // FFSH or SFSH
//   const rackNum = rackMatch[2];   // 1, 2, 3, 4, ...
//   const rackLetter = rackMatch[3].toUpperCase(); // A, B, C, D, ...

//   // Only convert if rackLetter is 'A' (like FFSH1A or SFSH3A)
//   if (rackLetter !== 'A') return basePath;

//   // Extract slot letter and number at end of path (e.g. C01)
//   const slotMatch = basePath.match(/\/([A-Z])(\d{2})$/i);
//   if (!slotMatch) return basePath;

//   const slotLetter = slotMatch[1].toUpperCase();
//   const slotNumber = slotMatch[2];

//   // Convert slotLetter dynamically:
//   // Only convert if slotLetter in [C, D, E]
//   if (!['C', 'D', 'E'].includes(slotLetter)) return basePath;

//   // Convert by subtracting 2 from ASCII code
//   const convertedSlotLetter = String.fromCharCode(slotLetter.charCodeAt(0) - 2);

//   // Replace the last slot part with converted letter + number
//   const newBasePath = basePath.replace(/\/[A-Z]\d{2}$/, `/${convertedSlotLetter}${slotNumber}`);
    
//     const location = getRackLocationFromId(slotName);
//     const rackName = getRackNameFromId(slotName);
//     const isThreePhase = slotName.includes('_T');
    
//     const serverHallInfo = DataService.getServerHallAndFloorFromOrd(ordPath);
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
//       midTempRh: null,
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
//       { key: 'midTempRh', path: 'midTempRh' },
//       { key: 'status', path: 'onnOffStatus' },
//       { key: 'totalKw', path: 'totalKw' },
//       { key: 'kwh', path: 'kwh' }
//     ];

//     const threePhasePoints = [
//       { key: 'redPhaseKw', path: 'RPHKw' },
//       { key: 'yellowPhaseKw', path: 'YPHKw' },
//       { key: 'bluePhaseKw', path: 'BPHKw' }
//     ];

//     const measurementPoints = isThreePhase
//       ? [...commonPoints, ...threePhasePoints]
//       : commonPoints;

//     for (const { key, path } of measurementPoints) {
//       // Path now includes the A01 level before the point name
//       const pointPath = `${basePath}/${path}`;
//       console.log("Attempting to fetch pointPath:", pointPath);
//       try {
//         const value = await fetchPointValue(pointPath);
//         if (value !== null && value !== undefined) {
//           rackData[key] = key === 'status' ? (value ? 'Online' : 'Offline') : value;
//         }
//       } catch (error) {
//         if (!error.message.includes("Slot doesn't exist")) {
//           console.warn(`Error fetching ${pointPath}:`, error);
//         }
//       }
//     }
    
//     console.log("Final rackData:", JSON.stringify(rackData, null, 2));
//     return rackData;

//   } catch (error) {
//     console.error(`Error processing rack ${ordPath}:`, error);
//     return null;
//   }
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
        if (bpoint === "Boolean Writable") {
          modifiedValue = displayValue.replace(/^(true|false)(.+)?$/i, "$1");
        } else {
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
      fetchPointValue
    };
  })(DataService);

  // UI Manager
   const UIManager = (function () {
        let sc;
        let $cart, $counter, $total;
        let currentViewMode = VIEW_MODES.TEMPERATURE;

        function initializeUI() {
            $counter = $('#counter');
            $total = $('#total');
            $cart = $('#selected-seats');
            setupEventHandlers();
            updateViewMode();
        }
        
        function setupEventHandlers() {
            $(".tempbtn").click(e => setViewMode(VIEW_MODES.TEMPERATURE));
            $(".powerbtn").click(e => setViewMode(VIEW_MODES.POWER));

            $("#dataTab").change(function () {
                setViewMode($(this).val());
            });

            $("#servers").change(function () {
                const selected = $(this).val();
                if (!selected) {
                    console.warn('[DEBUG] No server hall selected.');
                    return;
                }
                updateSeatMap(selected);
            });

            $("#floors").change(() => updateServers());
        }

        function setViewMode(mode) {
            currentViewMode = mode;
            window.location.hash = mode === VIEW_MODES.POWER ? 'powerSts' : 'tempSts';
            updateViewMode();
        }

        function updateViewMode() {
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
        }

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

// 2. Debug the actual seat IDs available
// console.log('Available seat IDs:', Object.keys(window.sc.seats));

// 3. Modified processing code
// Object.keys(window.sc.seats).forEach(async (seatId) => {
//     try {
//         console.log(`Processing seat ${seatId}`);
        
//         // Get the actual DOM element
//         const seatElement = document.getElementById(seatId);
//         if (!seatElement) {
//             console.warn(`Seat element ${seatId} not found in DOM`);
//             return;
//         }

//         // Find matching rack info - handle different ID formats
//         const cleanId = (id) => id.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
//         const matchingLoc = rackArray.find(loc => 
//             loc.id === seatId ||
//             cleanId(loc.id) === cleanId(seatId) ||
//             loc.id.replace(/_/g, '-') === seatId ||
//             loc.id.replace(/-/g, '_') === seatId
//         );

//         if (!matchingLoc) {
//             console.warn(`No rack info found for seat ${seatId}`);
//             seatElement.classList.remove('high-class', 'normal-class', 'low-class', 'blue-class');
//             seatElement.classList.add('rack-class');
//             return;
//         }

//         // Fetch rack data
//         const rackInfo = matchingLoc.rackInfo;
//         const rackData = await RackService.fetchRackData(
//             rackInfo.fullPath,
//             rackInfo.slotNames || [],
//             rackInfo
//         );

//         if (!rackData) {
//             console.warn(`[WARN] No data available for rack ${seatId}`);
//             seatElement.classList.remove('high-class', 'normal-class', 'low-class', 'blue-class');
//             seatElement.classList.add('rack-class');
//             return;
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

//         // Determine seat status and update classes directly on the DOM element
//         seatElement.classList.remove('high-class', 'normal-class', 'low-class', 'blue-class', 'rack-class');
        
//         if (totalKw === 0 || totalKwh === 0) {
//             seatElement.classList.add('high-class');
//         } else if (highTemp > 30 || midTemp > 30 || lowTemp > 30) {
//             seatElement.classList.add('high-class');
//         } else {
//             seatElement.classList.add('rack-class');
//         }

//     } catch (err) {
//         console.error(`[ERROR] Failed to set status for ${seatId}:`, err);
//         const seatElement = document.getElementById(seatId);
//         if (seatElement) {
//             seatElement.classList.remove('high-class', 'normal-class', 'low-class', 'blue-class');
//             seatElement.classList.add('rack-class');
//         }
//     }
// });

// First create a mapping of rack locations for efficient lookup
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

Object.keys(window.sc.seats).forEach(async (seatId) => {
    try {
        console.log(`Processing seat ${seatId}`);
        
        // Get the actual DOM element
        const seatElement = document.getElementById(seatId);
        if (!seatElement) {
            console.warn(`Seat element ${seatId} not found in DOM`);
            return;
        }

        // Find matching rack info using our pre-built map
        const clean = seatId.replace(/[^a-zA-Z0-9]/g, '');

    // Extract letter and number parts
    const match = clean.match(/^([A-Za-z])(\d+)$/);
    if (match) {
        const letter = match[1].toUpperCase(); // "A"
        const number = match[2].padStart(2, '0'); // "1" -> "01"
        const formatted = `${letter}_${number}`;
        console.log("Formatted Seat ID:", formatted);
        return formatted;
    }
        
        const matchingLoc = rackMap[seatId] || 
                          rackMap[cleanSeatId] || 
                          rackMap[altSeatId1] || 
                          rackMap[altSeatId2];

        if (!matchingLoc) {
            console.warn(`No rack info found for seat ${formatted}`);
            seatElement.classList.remove('high-class', 'normal-class', 'low-class', 'blue-class');
            seatElement.classList.add('rack-class');
            return;
        }

        // Fetch rack data
        const rackInfo = matchingLoc.rackInfo;
        console.log("rackinfo " + rackInfo);
        const rackData = await RackService.fetchRackData(
            rackInfo.fullPath,
            rackInfo.slotNames || [],
            rackInfo
        );
        console.log("rackInfo:", JSON.stringify(rackInfo, null, 2));

        if (!rackData) {
            console.warn(`[WARN] No data available for rack ${seatId}`);
            seatElement.classList.remove('high-class', 'normal-class', 'low-class', 'blue-class');
            seatElement.classList.add('rack-class');
            return;
        }

        // Extract temperature values
       const highTemp = typeof rackData.highTemp === 'string' 
            ? Number(rackData.highTemp.split(' ')[0]) || 0
            : Number(rackData.highTemp || 0);
        
        const midTemp = typeof rackData.midTemp === 'string' 
            ? Number(rackData.midTemp.split(' ')[0]) || 0
            : Number(rackData.midTemp || 0);
        
        const lowTemp = typeof rackData.lowTemp === 'string' 
            ? Number(rackData.lowTemp.split(' ')[0]) || 0
            : Number(rackData.lowTemp || 0);


        // Calculate total power usage
        let totalKw = rackData.totalKw || 0;
        let totalKwh = rackData.kwh || 0;

        if (rackData.slots) {
            totalKw = rackData.slots.reduce((sum, slot) => sum + (slot.totalKw || slot.Kw || 0), 0);
            totalKwh = rackData.slots.reduce((sum, slot) => sum + (slot.kwh || 0), 0);
        }

        // Determine seat status and update classes directly on the DOM element
        // seatElement.classList.remove('high-class', 'normal-class', 'low-class', 'blue-class', 'rack-class');
        
        if (totalKw === 0 || totalKwh === 0) {
            seatElement.classList.add('high-class');
        } else if (highTemp > 30 || midTemp > 30 || lowTemp > 30) {
            seatElement.classList.add('high-class');
        } else if (highTemp < 30 || midTemp < 30 || lowTemp < 30) {
            seatElement.classList.add('normal-class');
        }
        else {
            seatElement.classList.add('rack-class');
        }

    } catch (err) {
        console.error(`[ERROR] Failed to set status for ${seatId}:`, err);
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

        // Find matching rack - now matching by location (A_01 format)
        const rackInfo = hallData.racks.find(r => {
            return r.location === paddedRackId || 
                   r.rackname === paddedRackId ||
                   r.rackname.endsWith(paddedRackId);
        });

        if (!rackInfo) {
            console.warn(`No matching rack found for ${rackId} in ${selectedServerHall}`);
            return 'available';
        }

        // Use the fullPath which now includes the A01 level
        const rackData = await RackService.fetchRackData(
            rackInfo.fullPath,
            rackInfo.slotName, // Pass the slotName (A01) if needed
            rackInfo
        );

        if (!rackData) {
            console.warn(`No data for rack ${rackInfo.location}`);
            return 'available';
        }

        updateRackDetailsUI(rackData);

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

function updateRackDetailsUI(data) {
    console.log("Data to display:", JSON.stringify(data, null, 2));

    // Show all relevant sections
    $(".rackProperty td").addClass("showCol");
    console.log("Added .showCol to .rackProperty td");

    $(".rackProperty#tempStats").addClass("showCol");
    console.log("Added .showCol to #tempStats");

    $(".rackProperty#powerStats").addClass("showCol");
    console.log("Added .showCol to #powerStats");

    $("a.btn.btn-primary.rackLink").addClass("showCol");
    console.log("Added .showCol to rackLink");

    // Update basic values using rack-level data
    $('#highTempValue').text(data.highTemp ?? 'N/A');
    console.log("High Temp:", data.highTemp);

    $('#lowTempValue').text(data.lowTemp ?? 'N/A');
    console.log("Low Temp:", data.lowTemp);

    $('#midTempValue').text(data.midTemp ?? 'N/A');
    console.log("Mid Temp:", data.midTemp);

    $("#midTempRhValue").text(data.midTempRh ? `${data.midTempRh}%` : 'N/A');
    console.log("MidTempRhValue:", data.midTempRh);

    $('#totalKwValue').text(data.totalKw ?? 'N/A');
    console.log("Total kW:", data.totalKw);

    $('#kwhValue').text(data.kwh ?? 'N/A');
    console.log("KWH:", data.kwh);

    $('#statusValue').text(data.status);
    console.log("Status:", data.status);

    $('.rackName').text(data.rackName);
    console.log("Rack Name:", data.rackName);

    // Temperature and midTempRh Display Logic
    $("#temperatureValue1 a").html(`${data.highTemp ?? 'N/A'}°C`);
    console.log("Set #temperatureValue1:", data.highTemp);

    $("#temperatureValue2 a").html(`${data.midTemp ?? 'N/A'}°C`);
    console.log("Set #temperatureValue2:", data.midTemp);

    $("#temperatureValue3 a").html(`${data.lowTemp ?? 'N/A'}°C`);
    console.log("Set #temperatureValue3:", data.lowTemp);

    $("#midTempRhValue1").html(`${data.midTempRh ?? 'N/A'}%`);
    $("#midTempRhValue2").html(`${data.midTempRh ?? 'N/A'}%`);
    $("#midTempRhValue3").html(`${data.midTempRh ?? 'N/A'}%`);
    console.log("Set midTempRh values to all 3 displays:", data.midTempRh);

    // Power Display Logic
    const powerValue = data.totalKw ? `${data.totalKw} kW` : 'N/A';
    $("#powerValue a").html(powerValue);
    $("#powerValue1 a").html(powerValue);
    console.log("Set power values:", powerValue);

    // Set alert classes for temperatures
    const highTemp = parseFloat(data.highTemp) || 0;
    const midTemp = parseFloat(data.midTemp) || 0;
    const lowTemp = parseFloat(data.lowTemp) || 0;
    const midTempRh = parseFloat(data.midTempRh) || 0;

    console.log("Parsed Temps and midTempRh:", { highTemp, midTemp, lowTemp, midTempRh });

    $("#temperatureValue1 a").removeClass("alertDanger alertSuccess")
        .addClass(highTemp > 28 ? "alertDanger" : "alertSuccess");
    console.log("High temp alert:", highTemp > 28 ? "alertDanger" : "alertSuccess");

    $("#temperatureValue2 a").removeClass("alertDanger alertSuccess")
        .addClass(midTemp > 24 ? "alertDanger" : "alertSuccess");
    console.log("Mid temp alert:", midTemp > 24 ? "alertDanger" : "alertSuccess");

    $("#temperatureValue3 a").removeClass("alertDanger alertSuccess")
        .addClass(lowTemp > 20 ? "alertDanger" : "alertSuccess");
    console.log("Low temp alert:", lowTemp > 20 ? "alertDanger" : "alertSuccess");

    $("#midTempRhValue1, #midTempRhValue2, #midTempRhValue3").removeClass("alertDanger alertSuccess")
        .addClass(midTempRh < 20 || midTempRh > 60 ? "alertDanger" : "alertSuccess");
    console.log("midTempRh alert:", midTempRh < 20 || midTempRh > 60 ? "alertDanger" : "alertSuccess");

    // Power alert classes
    const power = parseFloat(data.totalKw) || 0;
    $("#powerValue a, #powerValue1 a").removeClass("alertDanger alertWarning alertSuccess")
        .addClass(
            power > 1500 ? "alertDanger" :
            power > 1000 ? "alertWarning" : "alertSuccess"
        );
    console.log("Power alert:", 
        power > 1500 ? "alertDanger" :
        power > 1000 ? "alertWarning" : "alertSuccess"
    );

    // Update status indicator
    const isOnline = data.status === true || data.status === "true" || data.status?.toLowerCase() === "online";
    $('#statusValue').removeClass("online offline")
        .addClass(isOnline ? "online" : "offline")
        .text(isOnline ? "Online" : "Offline");
    console.log("Status indicator class set to:", isOnline ? "online" : "offline");

    // Update slot information if available
    if (data.slots && data.slots.length > 0) {
        console.log("Processing slots data:", data.slots);
        data.slots.forEach((slot, index) => {
            const slotId = index + 1;
            $(`#slot${slotId}Name`).text(slot.slotName);
            $(`#slot${slotId}Source`).text(slot.source);
            $(`#slot${slotId}Status`).text(slot.status)
                .removeClass("online offline")
                .addClass(slot.status?.toLowerCase() === "online" ? "online" : "offline");
            
            if (slot.isThreePhase) {
                $(`#slot${slotId}Power`).text(`${slot.totalKw} kW (R:${slot.redPhaseKw} Y:${slot.yellowPhaseKw} B:${slot.bluePhaseKw})`);
            } else {
                $(`#slot${slotId}Power`).text(`${slot.Kw ?? slot.totalKw} kW`);
            }
            $(`#slot${slotId}Energy`).text(`${slot.kwh} kWh`);
        });
    }
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
            updateSeatMap
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
  $(document).ready(function() {
    console.log('[DEBUG] Document ready - initialization started');
    
    UIManager.initialize();
    
    DataService.getRackData().then(function(data) {
        if (data.length === 0) {
            console.warn('No rack data found.');
            $('#seat-map').html('<div class="alert alert-warning">No rack data available</div>');
        } else {
            console.log('Successfully loaded', data.length, 'rack entries');
            UIManager.createDynamicSelectors(DataService.getServerHalls());
            
            // Initialize with all floors available
            const floors = [...new Set(data.map(item => item.floor))].sort();
            $('#floors').empty().append(floors.map(f => 
                `<option value="${f}">Floor ${f}</option>`
            ));
            
            // Select first available floor (could be 1 or 2)
            if (floors.length > 0) {
                $('#floors').val(floors[0]).trigger('change');
            }
        }
    });
});
      })
      .fail(function(err) {
        console.error('Failed to load SeatCharts', err);
      });
   
 });
