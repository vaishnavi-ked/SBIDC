// window.downloadReport = function(format = "pdf") {
//     const now = new Date();
//     const nowStr = now.toISOString().split("T")[0];
//     const baseName = "Power_Consumption";
//     const logoURL = 'Public/img/kedlogo.png';

//     // Check if dates are selected
//     const hasDateSelection = startDate && endDate;
    
//     let fileName = hasDateSelection
//         ? `${baseName}_${nowStr}_(${startDate}_to_${endDate}).${format}`
//         : `${baseName}_${nowStr}.${format}`;

//     // Function to fetch and process data for download
//     function fetchAndDownload() {
//         window.rawData = {};
//         serverHalls.forEach(hall => {
//             window.rawData[hall] = [];
//         });

//         const promises = serverHalls.map(hall => {
//             const query = `local:|fox:|history:/sbi/${hall}?period=timeRange;start=${startDate}T00:00:00.000+05:30;end=${endDate}T23:59:00.000+05:30|bql:select timestamp as 'timestamp',value as 'value'`;
            
//             return baja.Ord.make(query).get({
//                 cursor: {
//                     each: function(row) { 
//                         const timestamp = new Date(row.get('timestamp'));
//                         const value = parseFloat(row.get('value'));
                        
//                         window.rawData[hall].push({
//                             datetime: timestamp,
//                             value: value
//                         });
//                     }
//                 }
//             });
//         });

//         Promise.all(promises)
//             .then(() => {
//                 // Combine all data by timestamp
//                 const combinedData = {};
                
//                 serverHalls.forEach(hall => {
//                     window.rawData[hall].forEach(item => {
//                         const timestamp = item.datetime.getTime();
//                         if (!combinedData[timestamp]) {
//                             combinedData[timestamp] = {
//                                 datetime: item.datetime,
//                                 values: {}
//                             };
//                         }
//                         combinedData[timestamp].values[hall] = item.value;
//                     });
//                 });
                
//                 // Convert to array and sort by datetime
//                 const sortedData = Object.values(combinedData).sort((a, b) => a.datetime - b.datetime);
                
//                 // Prepare rows for export - keep all data points
//                 const rows = sortedData.map((item, index) => {
//                     const row = {
//                         Index: index + 1,
//                         "Date & Time": item.datetime.toLocaleString('en-US', {
//                             year: 'numeric',
//                             month: '2-digit',
//                             day: '2-digit',
//                             hour: '2-digit',
//                             minute: '2-digit',
//                             second: '2-digit',
//                             hour12: false
//                         }).replace(/(\d+)\/(\d+)\/(\d+),?/, '$3-$1-$2')
//                     };
                    
//                     serverHalls.forEach((hall, i) => {
//                         row[`S${i+1} (kW)`] = (item.values[hall] || 0).toFixed(3);
//                     });
                    
//                     return row;
//                 });

//                 generateFile(rows);
//             })
//             .catch((err) => {
//                 console.error("Error fetching data for download:", err);
//                 alert("Error fetching data for download: " + err.message);
//             });
//     }

//     // Function to generate the actual file
//     function generateFile(rows) {
//         if (format === "pdf") {
//             try {
//                 const { jsPDF } = window.jspdf;
//                 const doc = new jsPDF();
//                 const logo = new Image();
                
//                 logo.onload = function() {
//                     // Add logo (top-left)
//                     doc.addImage(logo, 'PNG', 10, 10, 30, 10);
//                     generatePdfContent(doc);
//                 };
                
//                 logo.onerror = function() {
//                     generatePdfContent(doc);
//                 };
//                 logo.src = logoURL;
                
//                 function generatePdfContent(doc) {
//                     // Report title (centered)
//                     doc.setFontSize(16);
//                     const titleY = logo.complete ? 30 : 20;
//                     doc.text(`Power Consumption Report`, 100, titleY, { align: "center" });
                    
//                     // Generation timestamp (right-aligned)
//                     doc.setFontSize(10);
//                     doc.text(`Generated: ${now.toLocaleString()}`, 200, 10, { align: "right" });

//                     // Date range (if selected)
//                     if (hasDateSelection) {
//                         doc.setFontSize(12);
//                         doc.text(`Date Range: ${startDate} to ${endDate}`, 14, titleY + 10);
//                     }

//                     // Create the table
//                     const headers = ["Index", hasDateSelection ? "Date & Time" : "Month", ...serverHalls.map((_, i) => `S${i+1} (kW)`)];
//                     const body = rows.map(row => [
//                         row.Index,
//                         row[hasDateSelection ? "Date & Time" : "Month"],
//                         ...serverHalls.map((_, i) => row[`S${i+1} (kW)`])
//                     ]);

//                     doc.autoTable({
//                         startY: titleY + (hasDateSelection ? 20 : 10),
//                         head: [headers],
//                         body: body,
//                         styles: {
//                             overflow: 'linebreak',
//                             cellPadding: 3,
//                             fontSize: 10,
//                             halign: 'center',
//                             valign: 'middle'
//                         },
//                         margin: { top: titleY + (hasDateSelection ? 20 : 10) },
//                         columnStyles: {
//                             0: { cellWidth: 'auto' },
//                             1: { cellWidth: hasDateSelection ? 40 : 30 }
//                         }
//                     });

//                     doc.save(fileName);
//                 }
//             } catch (error) {
//                 console.error("PDF generation error:", error);
//                 alert("Failed to generate PDF. Please try another format.");
//             }
//         } else {
//             try {
//                 // For Excel/CSV
//                 const worksheet = XLSX.utils.json_to_sheet(rows);
//                 const workbook = XLSX.utils.book_new();
//                 XLSX.utils.book_append_sheet(workbook, worksheet, "Power Data");
                
//                 const wbout = XLSX.write(workbook, {
//                     bookType: format === "csv" ? "csv" : "xlsx",
//                     type: "array"
//                 });
                
//                 saveAs(new Blob([wbout], { type: "application/octet-stream" }), fileName);
//             } catch (error) {
//                 console.error("Excel/CSV generation error:", error);
//                 alert("Failed to generate Excel/CSV file.");
//             }
//         }
//     }

//     // Check if we need to fetch fresh data or use existing
//     if (hasDateSelection) {
//         // For date selection, fetch fresh data with no row limits
//         fetchAndDownload();
//     } else {
//         // For default view, use existing monthly data with month names
//         const hasData = serverHalls.every(hall => 
//             window.dailyData[hall] && window.dailyData[hall].length > 0
//         );
        
//         if (!hasData) {
//             alert("No data available for all server halls. Please fetch data first.");
//             return;
//         }

//         // Prepare monthly data with month names
//         const monthlyData = {};
        
//         serverHalls.forEach(hall => {
//             window.dailyData[hall].forEach(item => {
//                 const monthKey = item.date.toLocaleString('en-US', {
//                     year: 'numeric',
//                     month: 'long'
//                 });
                
//                 if (!monthlyData[monthKey]) {
//                     monthlyData[monthKey] = {
//                         monthName: monthKey,
//                         date: item.date,
//                         values: {}
//                     };
//                 }
//                 monthlyData[monthKey].values[hall] = item.value;
//             });
//         });
        
//         // Convert to array and sort by date
//         const sortedData = Object.values(monthlyData).sort((a, b) => a.date - b.date);
        
//         // Prepare rows for export
//         const rows = sortedData.map((item, index) => {
//             const row = {
//                 Index: index + 1,
//                 "Month": item.monthName
//             };
            
//             serverHalls.forEach((hall, i) => {
//                 row[`S${i+1} (kW)`] = (item.values[hall] || 0).toFixed(3);
//             });
            
//             return row;
//         });

//         generateFile(rows);
//     }
// };


document.addEventListener('DOMContentLoaded', function() {
  let currentDropdownId = null;
  let currentDropdownInstance = null;
  const calendarModal = document.getElementById("calendarModal");
  let datesSelected = false;
  
  // Initialize dropdowns
  const dropdownElements = document.querySelectorAll('.dropdown');
  const dropdownInstances = [];
  
  dropdownElements.forEach(dropdownElement => {
    const dropdownInstance = new bootstrap.Dropdown(dropdownElement);
    dropdownInstances.push({
      element: dropdownElement,
      instance: dropdownInstance
    });
  });
  
  // Date selection button handlers
  document.querySelectorAll('.select-dates-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      currentDropdownId = this.getAttribute('data-dropdown-id');
      datesSelected = false;
      
      const parentDropdown = this.closest('.dropdown');
      currentDropdownInstance = dropdownInstances.find(
        item => item.element === parentDropdown
      )?.instance;
      
      const dropdownRect = parentDropdown.getBoundingClientRect();
      
      calendarModal.style.display = "block";
      calendarModal.style.top = `${dropdownRect.bottom + window.scrollY}px`;
      calendarModal.style.left = `${dropdownRect.right - 250}px`;
    });
  });

  // Cancel button
  document.getElementById("cancelDateSelection")?.addEventListener("click", function(e) {
    e.stopPropagation();
    calendarModal.style.display = "none";
    closeCurrentDropdown();
  });

  // Apply button
  document.getElementById("applyDateSelection")?.addEventListener("click", function(e) {
    e.stopPropagation();
    const startDate = document.getElementById("startDate").value;
    const endDate = document.getElementById("endDate").value;
    
    if (startDate && endDate) {
      datesSelected = true;
      if (currentDropdownId) {
        const dateLabel = document.querySelector(`[data-dropdown-id="${currentDropdownId}"] .date-label`);
        if (dateLabel) {
          dateLabel.textContent = `${startDate} to ${endDate}`;
        }
      }
      calendarModal.style.display = "none";
      
      // Keep dropdown open
      if (currentDropdownInstance) {
        const dropdownMenu = currentDropdownInstance._menu;
        dropdownMenu.classList.add('show');
        currentDropdownInstance._element.setAttribute('aria-expanded', 'true');
      }
    } else {
      alert("Please select both start and end dates.");
    }
  });

  // Click outside handler
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.modal-calendar') && !e.target.closest('.select-dates-btn')) {
      calendarModal.style.display = "none";
      
      if (!datesSelected) {
        closeCurrentDropdown();
        resetDateSelection();
      }
    }
    
    if (datesSelected && !e.target.closest('.dropdown')) {
      closeCurrentDropdown();
      datesSelected = false;
    }
  });

  // Reset button
  document.getElementById("resetDates")?.addEventListener("click", function(e) {
    e.stopPropagation();
    resetDateSelection();
    if (currentDropdownInstance) {
      const dateLabel = document.querySelector(`[data-dropdown-id="${currentDropdownId}"] .date-label`);
      if (dateLabel) {
        dateLabel.textContent = 'Select Dates';
      }
    }
  });

  function resetDateSelection() {
    document.getElementById("startDate").value = '';
    document.getElementById("endDate").value = '';
    
    if (currentDropdownId) {
      const dateLabel = document.querySelector(`[data-dropdown-id="${currentDropdownId}"] .date-label`);
      if (dateLabel) {
        dateLabel.textContent = 'Select Dates';
      }
    }
    
    datesSelected = false;
  }
  
  function closeCurrentDropdown() {
    if (currentDropdownInstance) {
      currentDropdownInstance.hide();
      currentDropdownInstance = null;
    }
  }
  
  // Export button handlers
  document.querySelectorAll('.export-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      // Close the dropdown immediately when any format is clicked
      if (currentDropdownInstance) {
        currentDropdownInstance.hide();
        currentDropdownInstance = null;
      }
      
      const format = this.getAttribute('data-type').toLowerCase();
      const chartId = this.closest('.card').querySelector('.chart-area div').id;
      
      if (window.downloadReport) {
        window.downloadReport(format, chartId);
      } else {
        alert("Export functionality not ready yet. Please try again.");
      }
    });
  });
});

require(['jquery', 'baja!'], function ($, baja) {
  // Chart configuration for each chart
  const chartConfigs = {
    'chartdiv': {
      title: 'Power Consumption 1',
      queryPrefix: '/sbi/SVR',
      series: ['01', '02', '03', '04'],
      colors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A'],
      yAxisTitle: 'Power Consumption (kW)'
    },
    'chartdiv2': {
      title: 'Power Consumption 2',
      queryPrefix: '/sbi/HALL',
      series: ['A', 'B', 'C', 'D'],
      colors: ['#FFA500', '#9370DB', '#3CB371', '#FF6347'],
      yAxisTitle: 'Energy Usage (kWh)'
    },
    'heatmap_consumption': {
      title: 'Rack Cooling Index',
      queryPrefix: '/sbi/RACK',
      series: ['01', '02', '03', '04', '05'],
      colors: ['#1E90FF', '#32CD32', '#FFD700', '#FF69B4', '#BA55D3'],
      yAxisTitle: 'Temperature (°C)'
    }
  };

  // Global data storage
  window.chartData = {};
  window.charts = {};
  
  // Initialize all charts
  function initCharts() {
    Object.keys(chartConfigs).forEach(chartId => {
      if (document.getElementById(chartId)) {
        window.charts[chartId] = initChart(chartId, chartConfigs[chartId]);
        window.chartData[chartId] = {
          rawData: {},
          dailyData: {},
          startDate: null,
          endDate: null
        };
      }
    });
  }

  // Initialize a single chart
  function initChart(divId, config) {
    // Create chart instance
    let chart = am4core.create(divId, am4charts.XYChart);
    chart.paddingRight = 20;
    
    // Create date axis (X-axis)
    let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.minGridDistance = 60;
    dateAxis.renderer.labels.template.fill = am4core.color("#ffffff");
    
    // Format X-axis to show month names
    dateAxis.dateFormats.setKey("day", "MMM");
    dateAxis.periodChangeDateFormats.setKey("day", "MMM");
    
    // Create value axis (Y-axis)
    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.title.text = config.yAxisTitle;
    valueAxis.title.fill = am4core.color("#ffffff");
    valueAxis.renderer.labels.template.fill = am4core.color("#ffffff");
    
    // Create series for each item in config
    config.series.forEach((seriesId, index) => {
      const seriesName = `${config.queryPrefix.split('/').pop()}${seriesId}`;
      let series = chart.series.push(new am4charts.LineSeries());
      series.dataFields.dateX = "date";
      series.dataFields.valueY = seriesName;
      series.name = seriesName;
      series.tooltipText = "{name}: {valueY}";
      series.stroke = am4core.color(config.colors[index]);
      series.strokeWidth = 2;
      
      // Add bullets
      let bullet = series.bullets.push(new am4charts.CircleBullet());
      bullet.circle.stroke = am4core.color("#fff");
      bullet.circle.strokeWidth = 2;
      bullet.circle.radius = 4;
    });
    
    // Add cursor
    chart.cursor = new am4charts.XYCursor();
    chart.cursor.xAxis = dateAxis;
    chart.cursor.lineX.stroke = am4core.color("#ffffff");
    chart.cursor.lineY.stroke = am4core.color("#ffffff");
    
    // Add legend
    chart.legend = new am4charts.Legend();
    chart.legend.labels.template.fill = am4core.color("#ffffff"); 
    chart.logo.disabled = true;
    
    return chart;
  }

  // Fetch data for a specific chart
  window.fetchData = function(start, end, chartId, isDefault = false) {
    const config = chartConfigs[chartId];
    if (!config) {
      console.error(`No configuration found for chart ${chartId}`);
      return;
    }
    
    console.log(`Fetching data for ${chartId} from`, start, "to", end);
    
    // Reset data storage
    window.chartData[chartId].rawData = {};
    window.chartData[chartId].dailyData = {};
    config.series.forEach(seriesId => {
      const seriesName = `${config.queryPrefix.split('/').pop()}${seriesId}`;
      window.chartData[chartId].rawData[seriesName] = [];
      window.chartData[chartId].dailyData[seriesName] = [];
    });
    
    window.chartData[chartId].isDailyView = start === end;
    window.chartData[chartId].startDate = start;
    window.chartData[chartId].endDate = end;
    
    const promises = config.series.map(seriesId => {
      const seriesName = `${config.queryPrefix.split('/').pop()}${seriesId}`;
      const query = `local:|fox:|history:${config.queryPrefix}${seriesId}?period=timeRange;start=${start}T23:58:00.000+05:30;end=${end}T23:59:00.000+05:30|bql:select timestamp as 'timestamp',value as 'value'`;
      
      return baja.Ord.make(query).get({
        cursor: {
          each: function(row) { 
            const timestamp = new Date(row.get('timestamp'));
            const value = parseFloat(row.get('value'));
            
            window.chartData[chartId].rawData[seriesName].push({
              datetime: timestamp,
              value: value
            });
            
            if (window.chartData[chartId].isDailyView) {
              window.chartData[chartId].dailyData[seriesName].push({
                date: timestamp,
                value: value
              });
            }
          },
          limit: 10000000
        }
      });
    });
    
    Promise.all(promises)
      .then(() => {
        console.log(`Raw data counts for ${chartId}:`, 
          Object.fromEntries(
            config.series.map(seriesId => {
              const seriesName = `${config.queryPrefix.split('/').pop()}${seriesId}`;
              return [seriesName, window.chartData[chartId].rawData[seriesName].length];
            })
          ));
          
        if (!window.chartData[chartId].isDailyView) {
          config.series.forEach(seriesId => {
            const seriesName = `${config.queryPrefix.split('/').pop()}${seriesId}`;
            const groupedByDate = {};
            
            window.chartData[chartId].rawData[seriesName].forEach(item => {
              const dateKey = item.datetime.toISOString().split('T')[0];
              groupedByDate[dateKey] = {
                date: new Date(dateKey),
                value: item.value
              };
            });
            
            window.chartData[chartId].dailyData[seriesName] = Object.values(groupedByDate).sort((a, b) => a.date - b.date);
          });
        }
        
        // Prepare combined data
        const combinedData = [];
        const allDates = new Set();
        
        config.series.forEach(seriesId => {
          const seriesName = `${config.queryPrefix.split('/').pop()}${seriesId}`;
          window.chartData[chartId].dailyData[seriesName].forEach(item => {
            allDates.add(item.date.getTime());
          });
        });
        
        Array.from(allDates).sort().forEach(timestamp => {
          const dataPoint = { date: new Date(timestamp) };
          config.series.forEach(seriesId => {
            const seriesName = `${config.queryPrefix.split('/').pop()}${seriesId}`;
            const hallData = window.chartData[chartId].dailyData[seriesName].find(item => 
              item.date.getTime() === timestamp
            );
            dataPoint[seriesName] = hallData ? hallData.value : null;
          });
          combinedData.push(dataPoint);
        });
        
        // Update the specific chart
        if (window.charts[chartId]) {
          window.charts[chartId].data = combinedData;
        }
      })
      .catch((err) => {
        console.error(`Query failed for ${chartId}:`, err);
        alert(`Error fetching data for ${config.title}: ` + err.message);
      });
  };

  // Download report function for a specific chart
  window.downloadReport = function(format = "pdf", chartId) {
    const config = chartConfigs[chartId];
    if (!config) {
      console.error(`No configuration found for chart ${chartId}`);
      return;
    }
    
    const chartData = window.chartData[chartId];
    if (!chartData) {
      alert("No data available for this chart. Please fetch data first.");
      return;
    }
    
    const now = new Date();
    const nowStr = now.toISOString().split('T')[0];
    const baseName = config.title.replace(/\s+/g, '_');
    const logoURL = 'Public/img/kedlogo.png';

    // Check if dates are selected
    const hasDateSelection = chartData.startDate && chartData.endDate;
    
    let fileName = hasDateSelection
      ? `${baseName}_${nowStr}_(${chartData.startDate}_to_${chartData.endDate}).${format}`
      : `${baseName}_${nowStr}.${format}`;

    // Function to fetch and process data for download
    function fetchAndDownload() {
      chartData.rawData = {};
      config.series.forEach(seriesId => {
        const seriesName = `${config.queryPrefix.split('/').pop()}${seriesId}`;
        chartData.rawData[seriesName] = [];
      });

      const promises = config.series.map(seriesId => {
        const seriesName = `${config.queryPrefix.split('/').pop()}${seriesId}`;
        const query = `local:|fox:|history:${config.queryPrefix}${seriesId}?period=timeRange;start=${chartData.startDate}T00:00:00.000+05:30;end=${chartData.endDate}T23:59:00.000+05:30|bql:select timestamp as 'timestamp',value as 'value'`;
        console.log(query);
        
        return baja.Ord.make(query).get({
          cursor: {
            each: function(row) { 
              const timestamp = new Date(row.get('timestamp'));
              const value = parseFloat(row.get('value'));
              
              chartData.rawData[seriesName].push({
                datetime: timestamp,
                value: value
              });
            },
            limit: 10000000
          }
        });
      });

      Promise.all(promises)
        .then(() => {
          console.log('Raw data counts:', 
            Object.fromEntries(
              config.series.map(seriesId => {
                const seriesName = `${config.queryPrefix.split('/').pop()}${seriesId}`;
                return [seriesName, chartData.rawData[seriesName].length];
              })
            ));
            
          // Combine all data by timestamp
          const combinedData = {};
          
          config.series.forEach(seriesId => {
            const seriesName = `${config.queryPrefix.split('/').pop()}${seriesId}`;
            chartData.rawData[seriesName].forEach(item => {
              const timestamp = item.datetime.getTime();
              if (!combinedData[timestamp]) {
                combinedData[timestamp] = {
                  datetime: item.datetime,
                  values: {}
                };
              }
              combinedData[timestamp].values[seriesName] = item.value;
            });
          });
          
          // Convert to array and sort by datetime
          const sortedData = Object.values(combinedData).sort((a, b) => a.datetime - b.datetime);
          
          // Prepare rows for export - keep all data points
          const rows = sortedData.map((item, index) => {
            const row = {
              Index: index + 1,
              "Date & Time": item.datetime.toLocaleString('en-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true
              }).replace(/(\d+)\/(\d+)\/(\d+),?/, '$3-$1-$2')
            };
            
            config.series.forEach((seriesId, i) => {
              const seriesName = `${config.queryPrefix.split('/').pop()}${seriesId}`;
              row[`${seriesName} (${config.yAxisTitle.split('(').pop().split(')')[0] || 'Value'})`] = 
                (item.values[seriesName] || 0).toFixed(3);
            });
            
            return row;
          });

          generateFile(rows);
        })
        .catch((err) => {
          console.error("Error fetching data for download:", err);
          alert("Error fetching data for download: " + err.message);
        });
    }

    // Function to generate the actual file
    function generateFile(rows) {
      if (format === "pdf") {
        try {
          const { jsPDF } = window.jspdf;
          const doc = new jsPDF();
          const logo = new Image();
          
          logo.onload = function() {
            // Add logo (top-left)
            doc.addImage(logo, 'PNG', 10, 10, 30, 10);
            generatePdfContent(doc);
          };
          
          logo.onerror = function() {
            generatePdfContent(doc);
          };
          logo.src = logoURL;
          
          function generatePdfContent(doc) {
            // Report title (centered)
            doc.setFontSize(16);
            const titleY = logo.complete ? 30 : 20;
            doc.text(`${config.title} Report`, 100, titleY, { align: "center" });
            
            // Generation timestamp (right-aligned)
            doc.setFontSize(10);
            doc.text(`Generated: ${now.toLocaleString()}`, 200, 10, { align: "right" });

            // Date range (if selected)
            if (hasDateSelection) {
              doc.setFontSize(12);
              doc.text(`Date Range: ${chartData.startDate} to ${chartData.endDate}`, 14, titleY + 10);
            }

            // Create the table
            const headers = ["Index", hasDateSelection ? "Date & Time" : "Month", 
              ...config.series.map((seriesId) => {
                const seriesName = `${config.queryPrefix.split('/').pop()}${seriesId}`;
                return `${seriesName} (${config.yAxisTitle.split('(').pop().split(')')[0] || 'Value'})`;
              })
            ];
            
            const body = rows.map(row => [
              row.Index,
              row[hasDateSelection ? "Date & Time" : "Month"],
              ...config.series.map((seriesId) => {
                const seriesName = `${config.queryPrefix.split('/').pop()}${seriesId}`;
                return row[`${seriesName} (${config.yAxisTitle.split('(').pop().split(')')[0] || 'Value'})`];
              })
            ]);

            doc.autoTable({
              startY: titleY + (hasDateSelection ? 20 : 10),
              head: [headers],
              body: body,
              styles: {
                overflow: 'linebreak',
                cellPadding: 3,
                fontSize: 10,
                halign: 'center',
                valign: 'middle'
              },
              margin: { top: titleY + (hasDateSelection ? 20 : 10) },
              columnStyles: {
                0: { cellWidth: 'auto' },
                1: { cellWidth: hasDateSelection ? 40 : 30 }
              }
            });

            doc.save(fileName);
          }
        } catch (error) {
          console.error("PDF generation error:", error);
          alert("Failed to generate PDF. Please try another format.");
        }
      } else {
        try {
          // For Excel/CSV
          const worksheet = XLSX.utils.json_to_sheet(rows);
          const workbook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(workbook, worksheet, config.title.substring(0, 31));
          
          const wbout = XLSX.write(workbook, {
            bookType: format === "csv" ? "csv" : "xlsx",
            type: "array"
          });
          
          saveAs(new Blob([wbout], { type: "application/octet-stream" }), fileName);
        } catch (error) {
          console.error("Excel/CSV generation error:", error);
          alert("Failed to generate Excel/CSV file.");
        }
      }
    }

    // Check if we need to fetch fresh data or use existing
    if (hasDateSelection) {
      // For date selection, fetch fresh data with no row limits
      fetchAndDownload();
    } else {
      // For default view, use existing monthly data with month names
      const hasData = config.series.every(seriesId => {
        const seriesName = `${config.queryPrefix.split('/').pop()}${seriesId}`;
        return chartData.dailyData[seriesName] && chartData.dailyData[seriesName].length > 0;
      });
      
      if (!hasData) {
        alert("No data available for all series. Please fetch data first.");
        return;
      }

      // Prepare monthly data with month names
      const monthlyData = {};
      
      config.series.forEach(seriesId => {
        const seriesName = `${config.queryPrefix.split('/').pop()}${seriesId}`;
        chartData.dailyData[seriesName].forEach(item => {
          const monthKey = item.date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'long'
          });
          
          if (!monthlyData[monthKey]) {
            monthlyData[monthKey] = {
              monthName: monthKey,
              date: item.date,
              values: {}
            };
          }
          monthlyData[monthKey].values[seriesName] = item.value;
        });
      });
      
      // Convert to array and sort by date
      const sortedData = Object.values(monthlyData).sort((a, b) => a.date - b.date);
      
      // Prepare rows for export
      const rows = sortedData.map((item, index) => {
        const row = {
          Index: index + 1,
          "Month": item.monthName
        };
        
        config.series.forEach(seriesId => {
          const seriesName = `${config.queryPrefix.split('/').pop()}${seriesId}`;
          row[`${seriesName} (${config.yAxisTitle.split('(').pop().split(')')[0] || 'Value'})`] = 
            (item.values[seriesName] || 0).toFixed(3);
        });
        
        return row;
      });

      generateFile(rows);
    }
  };
  
  // Format date as YYYY-MM-DD
  function formatDate(date) {
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  }
  
  // Initialize the application
  function init() {
    initCharts();
    
    // Load default data for each chart
    const end = new Date();
    const start = new Date();
    start.setMonth(start.getMonth() - 11);
    start.setDate(30);
    end.setDate(30);
    
    Object.keys(chartConfigs).forEach(chartId => {
      if (document.getElementById(chartId)) {
        window.fetchData(
          formatDate(start), 
          formatDate(end), 
          chartId,
          true
        );
      }
    });
  }
  
  // Start the application
  init();
});