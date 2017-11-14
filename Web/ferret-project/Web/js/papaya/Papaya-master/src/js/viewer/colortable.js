
/*jslint browser: true, node: true */
/*global */

"use strict";

/*** Imports ***/
var papaya = papaya || {};
papaya.viewer = papaya.viewer || {};


/*** Constructor ***/
papaya.viewer.ColorTable = papaya.viewer.ColorTable || function (lutName, baseImage, colorTable) {
    var lut = null;

    if (colorTable !== undefined) {
        lut = colorTable;
    } else {
        lut = papaya.viewer.ColorTable.findLUT(lutName);
    }

    this.lutData = lut.data;
    this.maxLUT = 0;
    this.minLUT = 0;
    this.knotThresholds = [];
    this.knotRangeRatios = [];

    this.LUTarrayG = new Array(256);
    this.LUTarrayR = new Array(256);
    this.LUTarrayB = new Array(256);
    this.isBaseImage = baseImage;

    this.knotMin = this.lutData[0];
    this.knotMax = this.lutData[this.lutData.length - 1];
    this.useGradation = (typeof lut.gradation === "undefined") || lut.gradation;

    this.updateLUT(papaya.viewer.ColorTable.LUT_MIN, papaya.viewer.ColorTable.LUT_MAX);
};


/*** Static Pseudo-constants ***/

papaya.viewer.ColorTable.TABLE_GRAYSCALE = {"name": "Grayscale", "data": [[0, 0, 0, 0], [1, 1, 1, 1]],
    "gradation": true};
papaya.viewer.ColorTable.TABLE_SPECTRUM = {"name": "Spectrum", "data": [[0, 0, 0, 0], [0.1, 0, 0, 1], [0.33, 0, 1, 1],
    [0.5, 0, 1, 0], [0.66, 1, 1, 0], [0.9, 1, 0, 0], [1, 1, 1, 1]], "gradation": true};
papaya.viewer.ColorTable.TABLE_RED2YELLOW = {"name": "Overlay (Positives)", "data": [[0, 1, 0, 0], [1, 1, 1, 0]],
    "gradation": true};
papaya.viewer.ColorTable.TABLE_BLUE2GREEN = {"name": "Overlay (Negatives)", "data": [[0, 0, 0, 1], [1, 0, 1, 0]],
    "gradation": true};
papaya.viewer.ColorTable.TABLE_HOTANDCOLD = {"name": "Hot-and-Cold", "data": [[0, 0, 0, 1], [0.15, 0, 1, 1],
    [0.3, 0, 1, 0], [0.45, 0, 0, 0], [0.5, 0, 0, 0], [0.55, 0, 0, 0], [0.7, 1, 1, 0], [0.85, 1, 0, 0], [1, 1, 1, 1]],
    "gradation": true};
papaya.viewer.ColorTable.TABLE_GOLD = {"name": "Gold", "data": [[0, 0, 0, 0], [0.13, 0.19, 0.03, 0],
    [0.25, 0.39, 0.12, 0], [0.38, 0.59, 0.26, 0], [0.50, 0.80, 0.46, 0.08], [0.63, 0.99, 0.71, 0.21],
    [0.75, 0.99, 0.88, 0.34], [0.88, 0.99, 0.99, 0.48], [1, 0.90, 0.95, 0.61]], "gradation": true};
papaya.viewer.ColorTable.TABLE_RED2WHITE = {"name": "Red Overlay", "data": [[0, 0.75, 0, 0], [0.5, 1, 0.5, 0],
    [0.95, 1, 1, 0], [1, 1, 1, 1]], "gradation": true};
papaya.viewer.ColorTable.TABLE_GREEN2WHITE = {"name": "Green Overlay", "data": [[0, 0, 0.75, 0], [0.5, 0.5, 1, 0],
    [0.95, 1, 1, 0], [1, 1, 1, 1]], "gradation": true};
papaya.viewer.ColorTable.TABLE_BLUE2WHITE = {"name": "Blue Overlay", "data": [[0, 0, 0, 1], [0.5, 0, 0.5, 1],
    [0.95, 0, 1, 1], [1, 1, 1, 1]], "gradation": true};
papaya.viewer.ColorTable.TABLE_DTI_SPECTRUM = {"name": "Spectrum", "data": [[0, 1, 0, 0], [0.5, 0, 1, 0], [1, 0, 0, 1]],
    "gradation": true};
papaya.viewer.ColorTable.TABLE_FIRE = {"name": "Fire", "data": [[0, 0, 0, 0], [0.06, 0, 0, 0.36], [0.16, 0.29, 0, 0.75],
    [0.22, 0.48, 0, 0.89], [0.31, 0.68, 0, 0.6], [0.37, 0.76, 0, 0.36], [0.5, 0.94, 0.31, 0], [0.56, 1, 0.45, 0],
    [0.81, 1, 0.91, 0], [0.88, 1, 1, 0.38], [1,1,1,1]], "gradation": true};
    
papaya.viewer.ColorTable.TABLE_EV_DTI_SEGMENTATION = {"name": "Ev Dti Seg", "data": [ 
  [ 0.01449275,    0.9529411764705882,    0.9529411764705882,    0.9529411764705882 ],
  [ 0.0289855,    0.34509803921568627,    0.34509803921568627,    0.34509803921568627 ],
  [ 0.043478, 0.2, 1, 1 ],
  [ 0.05797, 1, 1, 0 ],
  [ 0.07246, 0.00784313725490196, 0, 0.20784313725490197 ],
  [ 0.0869565, 1, 0, 1 ],
  [ 0.10145, 0.00784313725490196, 1, 0.2 ],
  [ 0.11594, 0, 0, 0.803921568627451 ],
  [ 0.13043,    0.9568627450980393,    0.36470588235294116,    0.9568627450980393 ],
  [ 0.1449275, 1, 0.3333333333333333, 0 ],
  [ 0.15942, 0.8549019607843137, 0.43921568627450980392156862745098, 0.00784313725490196 ],
  [ 0.173913, 0, 0, 0.10980392156862745 ],
  [ 0.1884, 1, 0.27450980392156865, 0.10588235294117647 ],
  [ 0.304347, 1, 1, 0.20784313725490197 ],
  [ 0.31884, 0, 0.00784313725490196, 0 ],
  [ 0.33333, 0, 1, 0.8 ],
  [ 0.347826, 0, 0.20784313725490197, 1 ],
  [ 0.362318, 0, 0.2, 1 ],
  [ 0.37681159, 0.8, 0.8, 0.8 ],
  [ 0.391304,    0.20784313725490197,    0.20784313725490197,    0.00784313725490196 ],
  [ 0.405797,   0.20784313725490197,    0.00784313725490196,    0.00784313725490196 ],
  [ 0.42028985,    0.00784313725490196,    0.00784313725490196,    0.20784313725490197 ],
  [ 0.4347826, 0.8, 0.8, 0 ],
  [ 0.449275, 0.2, 0, 0.20784313725490197 ],
  [ 0.463768, 0, 0.20784313725490197, 0 ],
  [ 0.47826, 0.8, 0.2, 0 ],
  [ 0.49275, 0.8, 0.20784313725490197, 0.20784313725490197 ],
  [ 0.507246, 0.20784313725490197, 0.00784313725490196, 0.2 ],
  [ 0.57971, 1, 1, 0.8 ],
  [ 0.5942, 1, 0.8, 0.8 ],
  [ 0.608695, 1, 0.20784313725490197, 0.00784313725490196 ],
  [ 0.623188, 0.8, 0.8, 1 ],
  [ 0.637681159, 0.8, 1, 0.20784313725490197 ],
  [ 0.6521739, 0.8, 0.8, 0.20784313725490197 ],
  [ 0.666666, 1, 0.8, 0 ],
  [ 0.681159, 0.8, 0.20784313725490197, 1 ],
  [ 0.69565217, 0.8, 1, 1 ],
  [ 0.71014493, 1, 1, 0.10588235294117647 ],
  [ 0.72463768, 0.9725490196078431, 0.9725490196078431, 1 ],
  [ 0.73913, 0.8, 1, 0.2 ],
  [ 0.869565, 1, 0.00784313725490196, 0 ],
  [ 0.88405797, 1, 0, 0 ],
  [ 0.8985507, 0.8, 0, 0 ],
  [ 0.913043478, 0.20784313725490197, 0.2, 0 ],
  [ 0.927536, 1, 0, 1 ],
  [ 0.94202898, 1, 0, 0.20784313725490197 ],
  [ 0.956521739, 0.8, 0.2, 0.20784313725490197 ],
  [ 0.97101449, 1, 0.2, 0 ],
  [ 0.985507, 1, 0.2, 0.00784313725490196 ],
  [ 1, 0.8, 0.2, 0 ],
  [ 0, 0, 0, 0 ] ]
,
"gradation": false
}
    

papaya.viewer.ColorTable.ARROW_ICON = "data:image/gif;base64,R0lGODlhCwARAPfGMf//////zP//mf//Zv//M///AP/M///MzP/Mmf/M" +
    "Zv/MM//MAP+Z//+ZzP+Zmf+ZZv+ZM/+ZAP9m//9mzP9mmf9mZv9mM/9mAP8z//8zzP8zmf8zZv8zM/8zAP8A//8AzP8Amf8AZv8AM/8AAMz//8z/" +
    "zMz/mcz/Zsz/M8z/AMzM/8zMzMzMmczMZszMM8zMAMyZ/8yZzMyZmcyZZsyZM8yZAMxm/8xmzMxmmcxmZsxmM8xmAMwz/8wzzMwzmcwzZswzM8wz" +
    "AMwA/8wAzMwAmcwAZswAM8wAAJn//5n/zJn/mZn/Zpn/M5n/AJnM/5nMzJnMmZnMZpnMM5nMAJmZ/5mZzJmZmZmZZpmZM5mZAJlm/5lmzJlmmZlm" +
    "ZplmM5lmAJkz/5kzzJkzmZkzZpkzM5kzAJkA/5kAzJkAmZkAZpkAM5kAAGb//2b/zGb/mWb/Zmb/M2b/AGbM/2bMzGbMmWbMZmbMM2bMAGaZ/2aZ" +
    "zGaZmWaZZmaZM2aZAGZm/2ZmzGZmmWZmZmZmM2ZmAGYz/2YzzGYzmWYzZmYzM2YzAGYA/2YAzGYAmWYAZmYAM2YAADP//zP/zDP/mTP/ZjP/MzP/" +
    "ADPM/zPMzDPMmTPMZjPMMzPMADOZ/zOZzDOZmTOZZjOZMzOZADNm/zNmzDNmmTNmZjNmMzNmADMz/zMzzDMzmTMzZjMzMzMzADMA/zMAzDMAmTMA" +
    "ZjMAMzMAAAD//wD/zAD/mQD/ZgD/MwD/AADM/wDMzADMmQDMZgDMMwDMAACZ/wCZzACZmQCZZgCZMwCZAABm/wBmzABmmQBmZgBmMwBmAAAz/wAz" +
    "zAAzmQAzZgAzMwAzAAAA/wAAzAAAmQAAZgAAM+4AAN0AALsAAKoAAIgAAHcAAFUAAEQAACIAABEAAADuAADdAAC7AACqAACIAAB3AABVAABEAAAi" +
    "AAARAAAA7gAA3QAAuwAAqgAAiAAAdwAAVQAARAAAIgAAEe7u7t3d3bu7u6qqqoiIiHd3d1VVVURERCIiIhEREQAAACH5BAEAAMYALAAAAAALABEA" +
    "AAg/AI0JFGhvoEGC+vodRKgv4UF7DSMqZBixoUKIFSv2w5jRIseOGztK/JgxpMiEJDWmHHkSZUuTIvvt60ezps2AADs=";
papaya.viewer.ColorTable.ARROW_ICON_WIDTH = 11;

papaya.viewer.ColorTable.DEFAULT_COLOR_TABLE = papaya.viewer.ColorTable.TABLE_GRAYSCALE;

papaya.viewer.ColorTable.PARAMETRIC_COLOR_TABLES = [papaya.viewer.ColorTable.TABLE_RED2YELLOW,
    papaya.viewer.ColorTable.TABLE_BLUE2GREEN, papaya.viewer.ColorTable.TABLE_EV_DTI_SEGMENTATION,];

papaya.viewer.ColorTable.OVERLAY_COLOR_TABLES = [
    papaya.viewer.ColorTable.TABLE_RED2WHITE,
    papaya.viewer.ColorTable.TABLE_GREEN2WHITE,
    papaya.viewer.ColorTable.TABLE_EV_DTI_SEGMENTATION,
    papaya.viewer.ColorTable.TABLE_BLUE2WHITE,
    
];

papaya.viewer.ColorTable.TABLE_ALL = [
    papaya.viewer.ColorTable.TABLE_GRAYSCALE,
    papaya.viewer.ColorTable.TABLE_SPECTRUM,
    papaya.viewer.ColorTable.TABLE_FIRE,
    papaya.viewer.ColorTable.TABLE_HOTANDCOLD,
    papaya.viewer.ColorTable.TABLE_GOLD,
    papaya.viewer.ColorTable.TABLE_RED2YELLOW,
    papaya.viewer.ColorTable.TABLE_BLUE2GREEN,
    papaya.viewer.ColorTable.TABLE_RED2WHITE,
    papaya.viewer.ColorTable.TABLE_GREEN2WHITE,
    papaya.viewer.ColorTable.TABLE_BLUE2WHITE,
    papaya.viewer.ColorTable.TABLE_EV_DTI_SEGMENTATION,
];

papaya.viewer.ColorTable.LUT_MIN = 0;
papaya.viewer.ColorTable.LUT_MAX = 255;
papaya.viewer.ColorTable.ICON_SIZE = 18;
papaya.viewer.ColorTable.COLOR_BAR_WIDTH = 100;
papaya.viewer.ColorTable.COLOR_BAR_HEIGHT = 15;


/*** Static Methods ***/

papaya.viewer.ColorTable.findLUT = function (name) {
    var ctr;

    for (ctr = 0; ctr < papaya.viewer.ColorTable.TABLE_ALL.length; ctr += 1) {
        if (papaya.viewer.ColorTable.TABLE_ALL[ctr].name == name) {  // needs to be ==, not ===
            return papaya.viewer.ColorTable.TABLE_ALL[ctr];
        }
    }

    return papaya.viewer.ColorTable.TABLE_GRAYSCALE;
};



papaya.viewer.ColorTable.addCustomLUT = function (lut) {
    if (papaya.viewer.ColorTable.findLUT(lut.name).data === papaya.viewer.ColorTable.TABLE_GRAYSCALE.data) {
        papaya.viewer.ColorTable.TABLE_ALL.push(lut);
    }
};


/*** Prototype Methods ***/

papaya.viewer.ColorTable.prototype.updateMinLUT = function (minLUTnew) {
    this.updateLUT(minLUTnew, this.maxLUT);
};



papaya.viewer.ColorTable.prototype.updateMaxLUT = function (maxLUTnew) {
    this.updateLUT(this.minLUT, maxLUTnew);
};



papaya.viewer.ColorTable.prototype.updateLUT = function (minLUTnew, maxLUTnew) {
    var range, ctr, ctrKnot, value;

    this.maxLUT = maxLUTnew;
    this.minLUT = minLUTnew;
    range = this.maxLUT - this.minLUT;

    for (ctr = 0; ctr < this.lutData.length; ctr += 1) {
        this.knotThresholds[ctr] = (this.lutData[ctr][0] * range) + this.minLUT;
    }

    for (ctr = 0; ctr < (this.lutData.length - 1); ctr += 1) {
        this.knotRangeRatios[ctr] = papaya.viewer.ColorTable.LUT_MAX / (this.knotThresholds[ctr + 1] -
            this.knotThresholds[ctr]);
    }

    for (ctr = 0; ctr < 256; ctr += 1) {
        if (ctr <= this.minLUT) {
            this.LUTarrayR[ctr] = this.knotMin[1] * papaya.viewer.ColorTable.LUT_MAX;
            this.LUTarrayG[ctr] = this.knotMin[2] * papaya.viewer.ColorTable.LUT_MAX;
            this.LUTarrayB[ctr] = this.knotMin[3] * papaya.viewer.ColorTable.LUT_MAX;
        } else if (ctr > this.maxLUT) {
            this.LUTarrayR[ctr] = this.knotMax[1] * papaya.viewer.ColorTable.LUT_MAX;
            this.LUTarrayG[ctr] = this.knotMax[2] * papaya.viewer.ColorTable.LUT_MAX;
            this.LUTarrayB[ctr] = this.knotMax[3] * papaya.viewer.ColorTable.LUT_MAX;
        } else {
            for (ctrKnot = 0; ctrKnot < (this.lutData.length - 1); ctrKnot += 1) {
                if ((ctr > this.knotThresholds[ctrKnot]) && (ctr <= this.knotThresholds[ctrKnot + 1])) {
                    if (this.useGradation) {
                        value = (((ctr - this.knotThresholds[ctrKnot]) * this.knotRangeRatios[ctrKnot]) + 0.5) /
                            papaya.viewer.ColorTable.LUT_MAX;

                        this.LUTarrayR[ctr] = (((1 - value) * this.lutData[ctrKnot][1]) +
                            (value * this.lutData[ctrKnot + 1][1])) * papaya.viewer.ColorTable.LUT_MAX;
                        this.LUTarrayG[ctr] = (((1 - value) * this.lutData[ctrKnot][2]) +
                            (value * this.lutData[ctrKnot + 1][2])) * papaya.viewer.ColorTable.LUT_MAX;
                        this.LUTarrayB[ctr] = (((1 - value) * this.lutData[ctrKnot][3]) +
                            (value * this.lutData[ctrKnot + 1][3])) * papaya.viewer.ColorTable.LUT_MAX;
                    } else {
                        this.LUTarrayR[ctr] = (this.lutData[ctrKnot][1]) * papaya.viewer.ColorTable.LUT_MAX;
                        this.LUTarrayG[ctr] = (this.lutData[ctrKnot][2]) * papaya.viewer.ColorTable.LUT_MAX;
                        this.LUTarrayB[ctr] = (this.lutData[ctrKnot][3]) * papaya.viewer.ColorTable.LUT_MAX;
                    }
                }
            }
        }
    }
};



papaya.viewer.ColorTable.prototype.lookupRed = function (index) {
    /*jslint bitwise: true */

    if ((index >= 0) && (index < 256)) {
        return (this.LUTarrayR[index] & 0xff);
    }

    return 0;
};



papaya.viewer.ColorTable.prototype.lookupGreen = function (index) {
    /*jslint bitwise: true */

    if ((index >= 0) && (index < 256)) {
        return (this.LUTarrayG[index] & 0xff);
    }

    return 0;
};



papaya.viewer.ColorTable.prototype.lookupBlue = function (index) {
    /*jslint bitwise: true */

    if ((index >= 0) && (index < 256)) {
        return (this.LUTarrayB[index] & 0xff);
    }

    return 0;
};
