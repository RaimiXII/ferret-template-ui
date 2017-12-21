/*
  ChartJS helper
*/


var ChartHelper = function()
{
  var chart = null;
  
  var headers = {  
    'Group': 0,
    'Derived Label': 1,
    'ROI Label': 2,
    'File Path': 3,
    'ROI Value': 4
  };
  
  var init = function(c)
  {  
    chart = c;
    console.log(chart);
  };

  var setChart = function(c)
  {
    init(c);
  };
  
  var removeData = function()
  {
    chart.removeData();
  };

  var addData = function(data)
  {
    chart.addData(data.points, data.label);
  };
  
  var clearData = function(data)
  {
    var pts = chart.datasets[0].bars.length;    
    for(var i = 0; i < pts; i++)
    {
        chart.removeData();       
    }
    console.log('done clearing');
  };
  
  var updateChart = function(new_data, new_min, new_max)
  {  
    //var csv_as_json = chartHelper.CsvToJson(d);        
        var c_im_split = current_image.split('_');
        var c_im_type = c_im_split[c_im_split.length-1];
        var plot_col;
        var the_min;
        var the_max;
        if(c_im_type == "FA")
        {
            console.log("FAFAFAFAFAFAFAFAFA");
            the_min = 0;
            the_max = 1;
        }
        else
        {
            console.log("TRTRTRTRTRTR");
            the_min = 0;
            the_max = 1000;
        }
    console.log("UPDATING MIN -> " + new_min + "   AND    MAX -> " + new_max);
    chart.data.datasets[0].data = new_data;
  //  chart.data.labels[0] = (new_min);
//    chart.data.labels[new_data.length-1] = (new_max);
    chart.data.labels[0]= the_min;
    chart.data.labels[new_data.length-1] = the_max;
    chart.update();    
  }
  
  var CreateChart = function(div_tag, hgt)
  {  
    var ctx = document.getElementById(div_tag);
    
    ctx.height = hgt;
        var br = 'rgba(12, 12, 132, 0.2)';
        var bd            =  'rgba(0,0,0,1)';     
        var myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ["Min", "", "", "","","","","","","","","","","","","","","","","","","","","", "Max"],
                datasets: [{
                    label: '# of Voxels',
                    data: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],                        
                    backgroundColor: [
                        br,br,br,br,br,br,br,br,br,br,br,br,br,br,br,br,br,br,br,br,br,br,br,br,br,
                    ],
                    borderColor: [
                        bd,bd,bd,bd,bd,bd,bd,bd,bd,bd,bd,bd,bd,bd,bd,bd,bd,bd,bd,bd,bd,bd,bd,bd,bd,
                    ],                        
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero:true
                        }
                    }]
                },                    
            }
        });
            
    chart = myChart;
    return chart;
  }
  
  
  var randomScalingFactor = function(){ return Math.round(Math.random()*255)};
  
  var JsonToBarChartData = function(data)
  {
    // get unique ROI label names
    var lbls = getUniqueValuesInColumn(data, 'ROI Label');
    var dsets = [];
    var tmp;
    var red;
    var blue;
    var green;
    var str='';
    var rows_with_label;
    var rows_wl_and_derived_label;
    var vals_in_row_with_label;
    
    // number of bars
    for(var i = 0; i < lbls.values.length; i++)
    {
        // get all rows with ROI Label [i]
        rows_with_label = getRowsWithColumnValue(data, 'ROI Label', lbls.values[i]);
        // get all rows with ROI Label [i] and Derived Label 'AM'
        rows_wl_and_derived_label = getRowsWithColumnValue(rows_with_label, 'Derived Label', 'SK');
        // get all ROI Value elements with ROI Label [i], Derived Label 'FA' from each row
        vals_in_row_with_label = getColumnByName(rows_wl_and_derived_label, 'ROI Value');
        str   = "rgba(";
        red   = randomScalingFactor();
        green = randomScalingFactor();
        blue  = randomScalingFactor();
        tmp  = {
            fillColor : str+red+","+green+","+blue+",0.5)",
            strokeColor : str + red+","+green+","+blue+",0.8)",
            highlightFill : str+red+","+green+","+blue+",0.75)",
            highlightStroke : str+red+","+green+","+blue+",1)",
            data: vals_in_row_with_label
        };
        dsets.push(tmp);
    }
    return {
        labels : lbls.values,
        datasets : dsets
    };
  };  
  
  function processData(allText) 
  {
    var allTextLines = allText.split(/\r\n|\n/);
    var headers = allTextLines[0].split(',');
    var lines = [];

    // we have headers. skip
    for (var i=1; i<allTextLines.length; i++) {
        var data = allTextLines[i].split(',');
        if (data.length == headers.length) {
            var tarr = [];
            for (var j=0; j<headers.length; j++) {
                var d = data[j].replace(/["]/g, "");
                tarr.push(/*headers[j]+":"+*/parseFloat(d));
            }
            lines.push(tarr);
        }
    }
    return lines;
  };
  
  var CsvToJson = function(csv)
  {
        var formattedData = processData(csv);
        //console.log(formattedData)
        return formattedData;
  };  
  var getColumn = function(csv, index)
  {  
    var col = [];
    for(var i = 0; i < csv.length; /*a.k.a. # of rows*/ i++)
    {
        col.push(csv[i][index]);
    }
    return col;
  };
  var getRow = function(csv, index)
  {  
    var row = [];
                        /*a.k.a. # of cols*/
    for(var i = 0; i < csv[index].length; i++)
    {
        console.log('new row = '+csv[index][i]);
        row.push(csv[index][i]);
    }
    return row;
  };
  var getIndex = function(csv, i, j)
  {  
    return csv[i][j];    
  };  
  var getColumnByName = function(csv, value)
  {
    var out = null;
    out = getColumn(csv, headers[value]);
    return out;
  };
  
  var getRowsWithColumnValue = function(csv, colName, value)
  {
    var out = null;
    var matchingIndices = [];
    var rows = [];
    console.log('csv = ',csv);
    console.log('colname = ',colName);
    console.log('value = ',value);
    out = getColumnByName(csv, colName);
    for(var i = 0; i < out.length; i++)
    {
        console.log('Comparing: ',out[i], '    with    ',value);
        if(String(out[i]) === String(value))
        {
            rows.push(getRow(csv, i));
        }
    }
    return rows;
  };
  
  var SortFloatArray = function(arr){  
    return arr.sort(function(a,b) { return a - b;});
  }
  
  var MeanFloatArray = function(arr){
    
    var res = 0;
    for(var i=0; i<arr.length; i++)
    {
        res=res+arr[i];
    }
    res = res/arr.length;
    
    return res;
    
  };
  
  var StdDevFloatArray = function(arr){
    
    var mean_arr = MeanFloatArray(arr);
    
    var res = 0;
    for(var i=0; i<arr.length; i++)
    {
        var tmp = Math.pow((arr[i] - mean_arr), 2);
        res=res+tmp;
    }
    res = Math.sqrt(res/arr.length);
    
    return res;
    
  };
  
  var FindVolume = function(arr, res){
    var vox_vol = res[0]*res[1]*res[2];
    return arr.length * vox_vol;
  };
  
  
  var CreateHistogram = function(data, nbins, idx){  
  
    var v1 = getColumn(data, idx);    
    var n_entries = v1.length;    
    var sorted_v1 = SortFloatArray(v1);    
    var min_v1 = sorted_v1[0];
    var max_v1 = sorted_v1[n_entries-1];
    var range_v1 = (max_v1 - min_v1);
    var step_v1    = range_v1 / nbins;
    
    var mu = MeanFloatArray(sorted_v1);
    var sd = StdDevFloatArray(sorted_v1);
    var vol = FindVolume(sorted_v1, [0.5, 0.5, 0.5]);
    
    $("#roi_mean").html("Mean of ROI: <b>"+mu+" micrometer squared per second</b><br><br>")
    $("#roi_std_dev").html("Standard Deviation of ROI: <b>"+sd+"</b><br><br>")
    $("#roi_volume").html(" Volume: <b>"+vol+" micrometer squared per second</b><br><br>")

    var intervals = [];    var histogram =[];    
    for(var i=0; i < nbins; i++)
    {    
        intervals.push( (i*step_v1) + min_v1);                histogram.push(0);
    }    
    for(var i =0; i < n_entries; i++)
    {
        histogram[GetBinIndexOfValue(sorted_v1[i], intervals)] = histogram[GetBinIndexOfValue(sorted_v1[i], intervals)]+1;
    }
    updateChart(histogram, JRound(min_v1, 3), JRound(max_v1,2));
  };
  
  function JRound(value, decimals) {
      return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
    };
      
    var GetBinIndexOfValue = function(value, intervals){      
        for(var i =0; i < intervals.length-1; i++){            
            if( (value >= intervals[i])    &&  (value <= intervals[i+1])){                
                return i;
            }            
        }
        return -1;
    };
  
  var getUniqueValuesInColumn = function(csv, colName)
  {
    var u_vals = {   
        values: [],
        frequency: []    
    };    
    var col = getColumnByName(csv,colName);    
    var found = false;    
    for(var i = 0; i < col.length; i++)
    {    
        for(var j = 0; j < u_vals.values.length; j++)
        {
            if(u_vals.values[j] === col[i])
            {
                found = true;
                u_vals.frequency[j]++;
                break;
            }
        }
        if(!found)
        {
            u_vals.values.push(col[i]);
            u_vals.frequency.push(1);
        }
        found = false;
    }
    console.log('these are the unique column values: ');
    console.log(u_vals.values);    
    console.log('this is the frequency each occured: ');
    console.log(u_vals.frequency);
    return u_vals;
  };

  return {
    CreateChart:CreateChart,
    CreateHistogram: CreateHistogram,
    init: init,
    setChart: setChart,
    updateChart: updateChart,
    addData: addData,
    removeData: removeData,
    clearData: clearData,
    CsvToJson: CsvToJson,
    JsonToBarChartData:JsonToBarChartData,
    getColumn:getColumn,
    getRow:getRow,
    getIndex:getIndex,
    getColumnByName:getColumnByName,
    getRowsWithColumnValue:getRowsWithColumnValue,
    getUniqueValuesInColumn:getUniqueValuesInColumn,
  };
  
};
