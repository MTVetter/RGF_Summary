require([
    "esri/Map",
    "esri/views/MapView",
    "esri/widgets/BasemapToggle",
    "esri/widgets/Zoom",
    "esri/widgets/Home",
    "esri/widgets/Search",
    "esri/layers/FeatureLayer",
    "esri/tasks/Locator",
    "esri/geometry/Extent",
    "esri/renderers/smartMapping/creators/color",
    "esri/widgets/Legend",
    "esri/tasks/QueryTask",
    "esri/tasks/support/Query",
    "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.8.0/Chart.js",
    "esri/widgets/Expand"
], function(Map, MapView, BasemapToggle, Zoom, Home, Search, FeatureLayer, Locator, Extent, colorRendererCreator, Legend, QueryTask, Query, Chart, Expand){

    //===========================
    //Create the basic requirements
    var map = new Map({
        basemap: "streets-navigation-vector"
    });

    var view = new MapView({
        container: "viewDiv",
        map: map,
        center: [-95.444, 29.756],
        zoom: 8
    });
    view.ui.remove("zoom");

    var basemapToggle = new BasemapToggle({
        view: view,
        nextBasemap: "satellite"
    });

    var zoom = new Zoom({
        view: view
    });

    var home = new Home({
        view: view
    });

    //Search for desktop screens but no search on phones
    var searchWidget = new Search({
        view: view,
        includeDefaultSources: false,
        sources: [{
            locator: new Locator({
                url: "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer"
            }),
            singleLineFieldName: "SingleLine",
            outFields: ["Addr_type"],
            searchExtent: new Extent({
                xmax: -97.292800,
                ymax: 30.797600,
                xmin: -93.236100,
                ymin: 28.460500
            }),
            placeholder: "3555 Timmons Ln, Houston, TX"
        }]
    });

    //Legend for desktops
    var legendWidget = new Legend({
        view: view
    });

    //Legend for smaller devices
    var expandLegend = new Expand({
        view: view,
        content: new Legend({
            view: view
        })
    });

    //Determine the type of legend to use
    isResponsiveSize = view.widthBreakpoint === "xsmall";
    updateView(isResponsiveSize);

    //Watch for Breakpoints
    view.watch("widthBreakpoint", function(breakpoint){
        switch(breakpoint){
            case "xsmall":
            case "small":
                updateView(true);
                break;
            case "medium":
            case "large":
            case "xlarge":
                updateView(false);
                break;
            default:
        }
    });

    //===========================================
    //Create the different renderers
    var hpTractsRenderer2018 = {
        type: "class-breaks",
        field: "Household_Population_2018",
        legendOptions: {
            title: "2018 - Household Population"
        },
        defaultSymbol: {
            type: "simple-fill",
            color: "black",
            style: "backward-diagonal",
            outline: {
                width: 0.5,
                color: [50, 50, 50, 0.6]
            }
        },
        defaultLabel: "no data",
        classBreakInfos: [
            {
                minValue: 0,
                maxValue: 5000,
                symbol: {
                    type: "simple-fill",
                    color: [254,229,217, 0.7],
                    style: "solid",
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "0 to 5,500"
            }, {
                minValue: 5001,
                maxValue: 10000,
                symbol: {
                    type: "simple-fill",
                    color: [252,174,145, 0.7],
                    style: "solid",
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "5,001 to 10,000"
            }, {
                minValue: 10001,
                maxValue: 20000,
                symbol: {
                    type: "simple-fill",
                    color: [251,106,74, 0.7],
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "10,001 to 20,000"
            }, {
                minValue: 20001,
                maxValue: 35000,
                symbol: {
                    type: "simple-fill",
                    color: [222,45,38, 0.7],
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "20,001 to 35,000"
            }, {
                minValue: 35001,
                maxValue: 500000,
                symbol: {
                    type: "simple-fill",
                    color: [165,15,21, 0.7],
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "Greater than 35,000"
            }
        ]
    };

    var hpTractsRenderer2025 = {
        type: "class-breaks",
        field: "Household_Population_2025",
        legendOptions: {
            title: "2025 - Household Population"
        },
        defaultSymbol: {
            type: "simple-fill",
            color: "black",
            style: "backward-diagonal",
            outline: {
                width: 0.5,
                color: [50, 50, 50, 0.6]
            }
        },
        defaultLabel: "no data",
        classBreakInfos: [
            {
                minValue: 0,
                maxValue: 5000,
                symbol: {
                    type: "simple-fill",
                    color: [254,229,217, 0.7],
                    style: "solid",
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "0 to 5,000"
            }, {
                minValue: 5001,
                maxValue: 10000,
                symbol: {
                    type: "simple-fill",
                    color: [252,174,145, 0.7],
                    style: "solid",
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "5,001 to 10,000"
            }, {
                minValue: 10001,
                maxValue: 20000,
                symbol: {
                    type: "simple-fill",
                    color: [251,106,74, 0.7],
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "10,001 to 20,000"
            }, {
                minValue: 20001,
                maxValue: 35000,
                symbol: {
                    type: "simple-fill",
                    color: [222,45,38, 0.7],
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "20,001 to 35,000"
            }, {
                minValue: 35001,
                maxValue: 500000,
                symbol: {
                    type: "simple-fill",
                    color: [165,15,21, 0.7],
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "Greater than 35,000"
            }
        ]
    };

    var hpTractsRenderer2035 = {
        type: "class-breaks",
        field: "Household_Population_2035",
        legendOptions: {
            title: "2035 - Household Population"
        },
        defaultSymbol: {
            type: "simple-fill",
            color: "black",
            style: "backward-diagonal",
            outline: {
                width: 0.5,
                color: [50, 50, 50, 0.6]
            }
        },
        defaultLabel: "no data",
        classBreakInfos: [
            {
                minValue: 0,
                maxValue: 5000,
                symbol: {
                    type: "simple-fill",
                    color: [254,229,217, 0.7],
                    style: "solid",
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "0 to 5,000"
            }, {
                minValue: 5001,
                maxValue: 10000,
                symbol: {
                    type: "simple-fill",
                    color: [252,174,145, 0.7],
                    style: "solid",
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "5,001 to 10,000"
            }, {
                minValue: 10001,
                maxValue: 20000,
                symbol: {
                    type: "simple-fill",
                    color: [251,106,74, 0.7],
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "10,001 to 20,000"
            }, {
                minValue: 20001,
                maxValue: 35000,
                symbol: {
                    type: "simple-fill",
                    color: [222,45,38, 0.7],
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "20,001 to 35,000"
            }, {
                minValue: 35001,
                maxValue: 500000,
                symbol: {
                    type: "simple-fill",
                    color: [165,15,21, 0.7],
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "Greater than 35,000"
            }
        ]
    };

    var hpTractsRenderer2045 = {
        type: "class-breaks",
        field: "Household_Population_2045",
        legendOptions: {
            title: "2045 - Household Population"
        },
        defaultSymbol: {
            type: "simple-fill",
            color: "black",
            style: "backward-diagonal",
            outline: {
                width: 0.5,
                color: [50, 50, 50, 0.6]
            }
        },
        defaultLabel: "no data",
        classBreakInfos: [
            {
                minValue: 0,
                maxValue: 5000,
                symbol: {
                    type: "simple-fill",
                    color: [254,229,217, 0.7],
                    style: "solid",
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "0 to 5,000"
            }, {
                minValue: 5001,
                maxValue: 10000,
                symbol: {
                    type: "simple-fill",
                    color: [252,174,145, 0.7],
                    style: "solid",
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "5,001 to 10,000"
            }, {
                minValue: 10001,
                maxValue: 20000,
                symbol: {
                    type: "simple-fill",
                    color: [251,106,74, 0.7],
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "10,001 to 20,000"
            }, {
                minValue: 20001,
                maxValue: 35000,
                symbol: {
                    type: "simple-fill",
                    color: [222,45,38, 0.7],
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "20,001 to 35,000"
            }, {
                minValue: 35001,
                maxValue: 500000,
                symbol: {
                    type: "simple-fill",
                    color: [165,15,21, 0.7],
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "Greater than 35,000"
            }
        ]
    };

    var hhTractsRenderer2018 = {
        type: "class-breaks",
        field: "Households_2018",
        legendOptions: {
            title: "2018 - Households"
        },
        defaultSymbol: {
            type: "simple-fill",
            color: "black",
            style: "backward-diagonal",
            outline: {
                width: 0.5,
                color: [50, 50, 50, 0.6]
            }
        },
        defaultLabel: "no data",
        classBreakInfos: [
            {
                minValue: 0,
                maxValue: 1500,
                symbol: {
                    type: "simple-fill",
                    color: [254,229,217, 0.7],
                    style: "solid",
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "0 to 1,500"
            }, {
                minValue: 1501,
                maxValue: 3000,
                symbol: {
                    type: "simple-fill",
                    color: [252,174,145, 0.7],
                    style: "solid",
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "1,501 to 3,000"
            }, {
                minValue: 3000,
                maxValue: 5000,
                symbol: {
                    type: "simple-fill",
                    color: [251,106,74, 0.7],
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "3,000 to 5,000"
            }, {
                minValue: 5001,
                maxValue: 10000,
                symbol: {
                    type: "simple-fill",
                    color: [222,45,38, 0.7],
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "5,001 to 10,000"
            }, {
                minValue: 10000,
                maxValue: 500000,
                symbol: {
                    type: "simple-fill",
                    color: [165,15,21, 0.7],
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "Greater than 10,000"
            }
        ]
    };

    var hhTractsRenderer2025 = {
        type: "class-breaks",
        field: "Households_2025",
        legendOptions: {
            title: "2025 - Households"
        },
        defaultSymbol: {
            type: "simple-fill",
            color: "black",
            style: "backward-diagonal",
            outline: {
                width: 0.5,
                color: [50, 50, 50, 0.6]
            }
        },
        defaultLabel: "no data",
        classBreakInfos: [
            {
                minValue: 0,
                maxValue: 1500,
                symbol: {
                    type: "simple-fill",
                    color: [254,229,217, 0.7],
                    style: "solid",
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "0 to 1,500"
            }, {
                minValue: 1501,
                maxValue: 3000,
                symbol: {
                    type: "simple-fill",
                    color: [252,174,145, 0.7],
                    style: "solid",
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "1,501 to 3,000"
            }, {
                minValue: 3000,
                maxValue: 5000,
                symbol: {
                    type: "simple-fill",
                    color: [251,106,74, 0.7],
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "3,000 to 5,000"
            }, {
                minValue: 5001,
                maxValue: 10000,
                symbol: {
                    type: "simple-fill",
                    color: [222,45,38, 0.7],
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "5,001 to 10,000"
            }, {
                minValue: 10000,
                maxValue: 500000,
                symbol: {
                    type: "simple-fill",
                    color: [165,15,21, 0.7],
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "Greater than 10,000"
            }
        ]
    };

    var hhTractsRenderer2035 = {
        type: "class-breaks",
        field: "Households_2035",
        legendOptions: {
            title: "2035 - Households"
        },
        defaultSymbol: {
            type: "simple-fill",
            color: "black",
            style: "backward-diagonal",
            outline: {
                width: 0.5,
                color: [50, 50, 50, 0.6]
            }
        },
        defaultLabel: "no data",
        classBreakInfos: [
            {
                minValue: 0,
                maxValue: 1500,
                symbol: {
                    type: "simple-fill",
                    color: [254,229,217, 0.7],
                    style: "solid",
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "0 to 1,500"
            }, {
                minValue: 1501,
                maxValue: 3000,
                symbol: {
                    type: "simple-fill",
                    color: [252,174,145, 0.7],
                    style: "solid",
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "1,501 to 3,000"
            }, {
                minValue: 3000,
                maxValue: 5000,
                symbol: {
                    type: "simple-fill",
                    color: [251,106,74, 0.7],
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "3,000 to 5,000"
            }, {
                minValue: 5001,
                maxValue: 10000,
                symbol: {
                    type: "simple-fill",
                    color: [222,45,38, 0.7],
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "5,001 to 10,000"
            }, {
                minValue: 10000,
                maxValue: 500000,
                symbol: {
                    type: "simple-fill",
                    color: [165,15,21, 0.7],
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "Greater than 10,000"
            }
        ]
    };

    var hhTractsRenderer2045 = {
        type: "class-breaks",
        field: "Households_2045",
        legendOptions: {
            title: "2045 - Households"
        },
        defaultSymbol: {
            type: "simple-fill",
            color: "black",
            style: "backward-diagonal",
            outline: {
                width: 0.5,
                color: [50, 50, 50, 0.6]
            }
        },
        defaultLabel: "no data",
        classBreakInfos: [
            {
                minValue: 0,
                maxValue: 1500,
                symbol: {
                    type: "simple-fill",
                    color: [254,229,217, 0.7],
                    style: "solid",
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "0 to 1,500"
            }, {
                minValue: 1501,
                maxValue: 3000,
                symbol: {
                    type: "simple-fill",
                    color: [252,174,145, 0.7],
                    style: "solid",
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "1,501 to 3,000"
            }, {
                minValue: 3000,
                maxValue: 5000,
                symbol: {
                    type: "simple-fill",
                    color: [251,106,74, 0.7],
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "3,000 to 5,000"
            }, {
                minValue: 5001,
                maxValue: 10000,
                symbol: {
                    type: "simple-fill",
                    color: [222,45,38, 0.7],
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "5,001 to 10,000"
            }, {
                minValue: 10000,
                maxValue: 500000,
                symbol: {
                    type: "simple-fill",
                    color: [165,15,21, 0.7],
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "Greater than 10,000"
            }
        ]
    };

    var jTractsRenderer2018 = {
        type: "class-breaks",
        field: "Jobs_2018",
        legendOptions: {
            title: "2018 - Jobs"
        },
        defaultSymbol: {
            type: "simple-fill",
            color: "black",
            style: "backward-diagonal",
            outline: {
                width: 0.5,
                color: [50, 50, 50, 0.6]
            }
        },
        defaultLabel: "no data",
        classBreakInfos: [
            {
                minValue: 0,
                maxValue: 3000,
                symbol: {
                    type: "simple-fill",
                    color: [254,229,217, 0.7],
                    style: "solid",
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "0 to 3,000"
            }, {
                minValue: 3001,
                maxValue: 9000,
                symbol: {
                    type: "simple-fill",
                    color: [252,174,145, 0.7],
                    style: "solid",
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "3,001 to 9,000"
            }, {
                minValue: 9000,
                maxValue: 15000,
                symbol: {
                    type: "simple-fill",
                    color: [251,106,74, 0.7],
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "9,000 to 15,000"
            }, {
                minValue: 15001,
                maxValue: 20000,
                symbol: {
                    type: "simple-fill",
                    color: [222,45,38, 0.7],
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "15,001 to 20,000"
            }, {
                minValue: 20000,
                maxValue: 500000,
                symbol: {
                    type: "simple-fill",
                    color: [165,15,21, 0.7],
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "Greater than 20,000"
            }
        ]
    };

    var jTractsRenderer2025 = {
        type: "class-breaks",
        field: "Jobs_2025",
        legendOptions: {
            title: "2025 - Jobs"
        },
        defaultSymbol: {
            type: "simple-fill",
            color: "black",
            style: "backward-diagonal",
            outline: {
                width: 0.5,
                color: [50, 50, 50, 0.6]
            }
        },
        defaultLabel: "no data",
        classBreakInfos: [
            {
                minValue: 0,
                maxValue: 3000,
                symbol: {
                    type: "simple-fill",
                    color: [254,229,217, 0.7],
                    style: "solid",
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "0 to 3,000"
            }, {
                minValue: 3001,
                maxValue: 9000,
                symbol: {
                    type: "simple-fill",
                    color: [252,174,145, 0.7],
                    style: "solid",
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "3,001 to 9,000"
            }, {
                minValue: 9000,
                maxValue: 15000,
                symbol: {
                    type: "simple-fill",
                    color: [251,106,74, 0.7],
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "9,000 to 15,000"
            }, {
                minValue: 15001,
                maxValue: 20000,
                symbol: {
                    type: "simple-fill",
                    color: [222,45,38, 0.7],
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "15,001 to 20,000"
            }, {
                minValue: 20000,
                maxValue: 500000,
                symbol: {
                    type: "simple-fill",
                    color: [165,15,21, 0.7],
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "Greater than 20,000"
            }
        ]
    };

    var jTractsRenderer2035 = {
        type: "class-breaks",
        field: "Jobs_2035",
        legendOptions: {
            title: "2035 - Jobs"
        },
        defaultSymbol: {
            type: "simple-fill",
            color: "black",
            style: "backward-diagonal",
            outline: {
                width: 0.5,
                color: [50, 50, 50, 0.6]
            }
        },
        defaultLabel: "no data",
        classBreakInfos: [
            {
                minValue: 0,
                maxValue: 3000,
                symbol: {
                    type: "simple-fill",
                    color: [254,229,217, 0.7],
                    style: "solid",
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "0 to 3,000"
            }, {
                minValue: 3001,
                maxValue: 9000,
                symbol: {
                    type: "simple-fill",
                    color: [252,174,145, 0.7],
                    style: "solid",
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "3,001 to 9,000"
            }, {
                minValue: 9000,
                maxValue: 15000,
                symbol: {
                    type: "simple-fill",
                    color: [251,106,74, 0.7],
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "9,000 to 15,000"
            }, {
                minValue: 15001,
                maxValue: 20000,
                symbol: {
                    type: "simple-fill",
                    color: [222,45,38, 0.7],
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "15,001 to 20,000"
            }, {
                minValue: 20000,
                maxValue: 500000,
                symbol: {
                    type: "simple-fill",
                    color: [165,15,21, 0.7],
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "Greater than 20,000"
            }
        ]
    };

    var jTractsRenderer2045 = {
        type: "class-breaks",
        field: "Jobs_2045",
        legendOptions: {
            title: "2045 - Jobs"
        },
        defaultSymbol: {
            type: "simple-fill",
            color: "black",
            style: "backward-diagonal",
            outline: {
                width: 0.5,
                color: [50, 50, 50, 0.6]
            }
        },
        defaultLabel: "no data",
        classBreakInfos: [
            {
                minValue: 0,
                maxValue: 3000,
                symbol: {
                    type: "simple-fill",
                    color: [254,229,217, 0.7],
                    style: "solid",
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "0 to 3,000"
            }, {
                minValue: 3001,
                maxValue: 9000,
                symbol: {
                    type: "simple-fill",
                    color: [252,174,145, 0.7],
                    style: "solid",
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "3,001 to 9,000"
            }, {
                minValue: 9000,
                maxValue: 15000,
                symbol: {
                    type: "simple-fill",
                    color: [251,106,74, 0.7],
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "9,000 to 15,000"
            }, {
                minValue: 15001,
                maxValue: 20000,
                symbol: {
                    type: "simple-fill",
                    color: [222,45,38, 0.7],
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "15,001 to 20,000"
            }, {
                minValue: 20000,
                maxValue: 500000,
                symbol: {
                    type: "simple-fill",
                    color: [165,15,21, 0.7],
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "Greater than 20,000"
            }
        ]
    };

    var hpTractsGrowth = {
        type: "class-breaks",
        field: "HouseholdPopulation_Growth_Diff",
        legendOptions: {
            title: "2018-2045 Population Growth"
        },
        defaultSymbol: {
            type: "simple-fill",
            color: "black",
            style: "backward-diagonal",
            outline: {
                width: 0.5,
                color: [50, 50, 50, 0.6]
            }
        },
        defaultLabel: "no data",
        classBreakInfos: [
            {
                minValue: -4000,
                maxValue: 3000,
                symbol: {
                    type: "simple-fill",
                    color: [254,229,217, 0.7],
                    style: "solid",
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "0 to 3,000"
            }, {
                minValue: 3001,
                maxValue: 12000,
                symbol: {
                    type: "simple-fill",
                    color: [252,174,145, 0.7],
                    style: "solid",
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "3,001 to 12,000"
            }, {
                minValue: 12001,
                maxValue: 20000,
                symbol: {
                    type: "simple-fill",
                    color: [251,106,74, 0.7],
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "12,001 to 20,000"
            }, {
                minValue: 20001,
                maxValue: 30000,
                symbol: {
                    type: "simple-fill",
                    color: [222,45,38, 0.7],
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "20,001 to 30,000"
            }, {
                minValue: 30001,
                maxValue: 500000,
                symbol: {
                    type: "simple-fill",
                    color: [165,15,21, 0.7],
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "Greater than 30,000"
            }
        ]
    };

    var hhTractsGrowth = {
        type: "class-breaks",
        field: "Household_Growth_Difference",
        legendOptions: {
            title: "2018-2045 Household Growth"
        },
        defaultSymbol: {
            type: "simple-fill",
            color: "black",
            style: "backward-diagonal",
            outline: {
                width: 0.5,
                color: [50, 50, 50, 0.6]
            }
        },
        defaultLabel: "no data",
        classBreakInfos: [
            {
                minValue: -4000,
                maxValue: 1500,
                symbol: {
                    type: "simple-fill",
                    color: [254,229,217, 0.7],
                    style: "solid",
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "0 to 1,500"
            }, {
                minValue: 1501,
                maxValue: 6500,
                symbol: {
                    type: "simple-fill",
                    color: [252,174,145, 0.7],
                    style: "solid",
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "1,501 to 6,500"
            }, {
                minValue: 6501,
                maxValue: 15500,
                symbol: {
                    type: "simple-fill",
                    color: [251,106,74, 0.7],
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "6,501 to 15,500"
            }, {
                minValue: 15501,
                maxValue: 30000,
                symbol: {
                    type: "simple-fill",
                    color: [222,45,38, 0.7],
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "15,501 to 30,000"
            }, {
                minValue: 30001,
                maxValue: 500000,
                symbol: {
                    type: "simple-fill",
                    color: [165,15,21, 0.7],
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "Greater than 30,000"
            }
        ]
    };

    var jTractsGrowth = {
        type: "class-breaks",
        field: "Job_Growth_Difference",
        legendOptions: {
            title: "2018-2045 Job Growth"
        },
        defaultSymbol: {
            type: "simple-fill",
            color: "black",
            style: "backward-diagonal",
            outline: {
                width: 0.5,
                color: [50, 50, 50, 0.6]
            }
        },
        defaultLabel: "no data",
        classBreakInfos: [
            {
                minValue: -4000,
                maxValue: 1500,
                symbol: {
                    type: "simple-fill",
                    color: [254,229,217, 0.7],
                    style: "solid",
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "0 to 1,500"
            }, {
                minValue: 1501,
                maxValue: 5500,
                symbol: {
                    type: "simple-fill",
                    color: [252,174,145, 0.7],
                    style: "solid",
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "1,501 to 5,500"
            }, {
                minValue: 5501,
                maxValue: 14500,
                symbol: {
                    type: "simple-fill",
                    color: [251,106,74, 0.7],
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "5,501 to 14,500"
            }, {
                minValue: 14501,
                maxValue: 30000,
                symbol: {
                    type: "simple-fill",
                    color: [222,45,38, 0.7],
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "14,501 to 30,000"
            }, {
                minValue: 30001,
                maxValue: 500000,
                symbol: {
                    type: "simple-fill",
                    color: [165,15,21, 0.7],
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "Greater than 30,000"
            }
        ]
    };

    //Taz renderers
    var hpTazRenderer2018 = {
        type: "class-breaks",
        field: "Household_Population_2018",
        legendOptions: {
            title: "2018 - Household Population"
        },
        defaultSymbol: {
            type: "simple-fill",
            color: "black",
            style: "backward-diagonal",
            outline: {
                width: 0.5,
                color: [50, 50, 50, 0.6]
            }
        },
        defaultLabel: "no data",
        classBreakInfos: [
            {
                minValue: 0,
                maxValue: 1000,
                symbol: {
                    type: "simple-fill",
                    color: [254,229,217, 0.7],
                    style: "solid",
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "0 to 1,000"
            }, {
                minValue: 1001,
                maxValue: 2500,
                symbol: {
                    type: "simple-fill",
                    color: [252,174,145, 0.7],
                    style: "solid",
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "1,001 to 2,500"
            }, {
                minValue: 2501,
                maxValue: 5000,
                symbol: {
                    type: "simple-fill",
                    color: [251,106,74, 0.7],
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "2,501 to 5,000"
            }, {
                minValue: 5001,
                maxValue: 7500,
                symbol: {
                    type: "simple-fill",
                    color: [222,45,38, 0.7],
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "5,001 to 7,500"
            }, {
                minValue: 7501,
                maxValue: 100000,
                symbol: {
                    type: "simple-fill",
                    color: [165,15,21, 0.7],
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "Greater than 7,500"
            }
        ]
    };

    var hpTazRenderer2025 = {
        type: "class-breaks",
        field: "Household_Population_2025",
        legendOptions: {
            title: "2025 - Household Population"
        },
        defaultSymbol: {
            type: "simple-fill",
            color: "black",
            style: "backward-diagonal",
            outline: {
                width: 0.5,
                color: [50, 50, 50, 0.6]
            }
        },
        defaultLabel: "no data",
        classBreakInfos: [
            {
                minValue: 0,
                maxValue: 1000,
                symbol: {
                    type: "simple-fill",
                    color: [254,229,217, 0.7],
                    style: "solid",
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "0 to 1,000"
            }, {
                minValue: 1001,
                maxValue: 2500,
                symbol: {
                    type: "simple-fill",
                    color: [252,174,145, 0.7],
                    style: "solid",
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "1,001 to 2,500"
            }, {
                minValue: 2501,
                maxValue: 5000,
                symbol: {
                    type: "simple-fill",
                    color: [251,106,74, 0.7],
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "2,501 to 5,000"
            }, {
                minValue: 5001,
                maxValue: 7500,
                symbol: {
                    type: "simple-fill",
                    color: [222,45,38, 0.7],
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "5,001 to 7,500"
            }, {
                minValue: 7501,
                maxValue: 100000,
                symbol: {
                    type: "simple-fill",
                    color: [165,15,21, 0.7],
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "Greater than 7,500"
            }
        ]
    };

    var hpTazRenderer2035 = {
        type: "class-breaks",
        field: "Household_Population_2035",
        legendOptions: {
            title: "2035 - Household Population"
        },
        defaultSymbol: {
            type: "simple-fill",
            color: "black",
            style: "backward-diagonal",
            outline: {
                width: 0.5,
                color: [50, 50, 50, 0.6]
            }
        },
        defaultLabel: "no data",
        classBreakInfos: [
            {
                minValue: 0,
                maxValue: 1000,
                symbol: {
                    type: "simple-fill",
                    color: [254,229,217, 0.7],
                    style: "solid",
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "0 to 1,000"
            }, {
                minValue: 1001,
                maxValue: 2500,
                symbol: {
                    type: "simple-fill",
                    color: [252,174,145, 0.7],
                    style: "solid",
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "1,001 to 2,500"
            }, {
                minValue: 2501,
                maxValue: 5000,
                symbol: {
                    type: "simple-fill",
                    color: [251,106,74, 0.7],
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "2,501 to 5,000"
            }, {
                minValue: 5001,
                maxValue: 7500,
                symbol: {
                    type: "simple-fill",
                    color: [222,45,38, 0.7],
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "5,001 to 7,500"
            }, {
                minValue: 7501,
                maxValue: 100000,
                symbol: {
                    type: "simple-fill",
                    color: [165,15,21, 0.7],
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "Greater than 7,500"
            }
        ]
    };

    var hpTazRenderer2045 = {
        type: "class-breaks",
        field: "Household_Population_2045",
        legendOptions: {
            title: "2045 - Household Population"
        },
        defaultSymbol: {
            type: "simple-fill",
            color: "black",
            style: "backward-diagonal",
            outline: {
                width: 0.5,
                color: [50, 50, 50, 0.6]
            }
        },
        defaultLabel: "no data",
        classBreakInfos: [
            {
                minValue: 0,
                maxValue: 1000,
                symbol: {
                    type: "simple-fill",
                    color: [254,229,217, 0.7],
                    style: "solid",
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "0 to 1,000"
            }, {
                minValue: 1001,
                maxValue: 2500,
                symbol: {
                    type: "simple-fill",
                    color: [252,174,145, 0.7],
                    style: "solid",
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "1,001 to 2,500"
            }, {
                minValue: 2501,
                maxValue: 5000,
                symbol: {
                    type: "simple-fill",
                    color: [251,106,74, 0.7],
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "2,501 to 5,000"
            }, {
                minValue: 5001,
                maxValue: 7500,
                symbol: {
                    type: "simple-fill",
                    color: [222,45,38, 0.7],
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "5,001 to 7,500"
            }, {
                minValue: 7501,
                maxValue: 100000,
                symbol: {
                    type: "simple-fill",
                    color: [165,15,21, 0.7],
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "Greater than 7,500"
            }
        ]
    };

    var hhTazRenderer2018 = {
        type: "class-breaks",
        field: "Households_2018",
        legendOptions: {
            title: "2018 - Households"
        },
        defaultSymbol: {
            type: "simple-fill",
            color: "black",
            style: "backward-diagonal",
            outline: {
                width: 0.5,
                color: [50, 50, 50, 0.6]
            }
        },
        defaultLabel: "no data",
        classBreakInfos: [
            {
                minValue: 0,
                maxValue: 250,
                symbol: {
                    type: "simple-fill",
                    color: [254,229,217, 0.7],
                    style: "solid",
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "0 to 250"
            }, {
                minValue: 251,
                maxValue: 750,
                symbol: {
                    type: "simple-fill",
                    color: [252,174,145, 0.7],
                    style: "solid",
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "251 to 750"
            }, {
                minValue: 751,
                maxValue: 1450,
                symbol: {
                    type: "simple-fill",
                    color: [251,106,74, 0.7],
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "751 to 1,450"
            }, {
                minValue: 1451,
                maxValue: 2550,
                symbol: {
                    type: "simple-fill",
                    color: [222,45,38, 0.7],
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "1,451 to 2,550"
            }, {
                minValue: 2551,
                maxValue: 100000,
                symbol: {
                    type: "simple-fill",
                    color: [165,15,21, 0.7],
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "Greater than 2,550"
            }
        ]
    };

    var hhTazRenderer2025 = {
        type: "class-breaks",
        field: "Households_2025",
        legendOptions: {
            title: "2025 - Households"
        },
        defaultSymbol: {
            type: "simple-fill",
            color: "black",
            style: "backward-diagonal",
            outline: {
                width: 0.5,
                color: [50, 50, 50, 0.6]
            }
        },
        defaultLabel: "no data",
        classBreakInfos: [
            {
                minValue: 0,
                maxValue: 250,
                symbol: {
                    type: "simple-fill",
                    color: [254,229,217, 0.7],
                    style: "solid",
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "0 to 250"
            }, {
                minValue: 251,
                maxValue: 750,
                symbol: {
                    type: "simple-fill",
                    color: [252,174,145, 0.7],
                    style: "solid",
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "251 to 750"
            }, {
                minValue: 751,
                maxValue: 1450,
                symbol: {
                    type: "simple-fill",
                    color: [251,106,74, 0.7],
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "751 to 1,450"
            }, {
                minValue: 1451,
                maxValue: 2550,
                symbol: {
                    type: "simple-fill",
                    color: [222,45,38, 0.7],
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "1,451 to 2,550"
            }, {
                minValue: 2551,
                maxValue: 100000,
                symbol: {
                    type: "simple-fill",
                    color: [165,15,21, 0.7],
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "Greater than 2,550"
            }
        ]
    };

    var hhTazRenderer2035 = {
        type: "class-breaks",
        field: "Households_2035",
        legendOptions: {
            title: "2035 - Households"
        },
        defaultSymbol: {
            type: "simple-fill",
            color: "black",
            style: "backward-diagonal",
            outline: {
                width: 0.5,
                color: [50, 50, 50, 0.6]
            }
        },
        defaultLabel: "no data",
        classBreakInfos: [
            {
                minValue: 0,
                maxValue: 250,
                symbol: {
                    type: "simple-fill",
                    color: [254,229,217, 0.7],
                    style: "solid",
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "0 to 250"
            }, {
                minValue: 251,
                maxValue: 750,
                symbol: {
                    type: "simple-fill",
                    color: [252,174,145, 0.7],
                    style: "solid",
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "251 to 750"
            }, {
                minValue: 751,
                maxValue: 1450,
                symbol: {
                    type: "simple-fill",
                    color: [251,106,74, 0.7],
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "751 to 1,450"
            }, {
                minValue: 1451,
                maxValue: 2550,
                symbol: {
                    type: "simple-fill",
                    color: [222,45,38, 0.7],
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "1,451 to 2,550"
            }, {
                minValue: 2551,
                maxValue: 100000,
                symbol: {
                    type: "simple-fill",
                    color: [165,15,21, 0.7],
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "Greater than 2,550"
            }
        ]
    };

    var hhTazRenderer2045 = {
        type: "class-breaks",
        field: "Households_2045",
        legendOptions: {
            title: "2045 - Households"
        },
        defaultSymbol: {
            type: "simple-fill",
            color: "black",
            style: "backward-diagonal",
            outline: {
                width: 0.5,
                color: [50, 50, 50, 0.6]
            }
        },
        defaultLabel: "no data",
        classBreakInfos: [
            {
                minValue: 0,
                maxValue: 250,
                symbol: {
                    type: "simple-fill",
                    color: [254,229,217, 0.7],
                    style: "solid",
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "0 to 250"
            }, {
                minValue: 251,
                maxValue: 750,
                symbol: {
                    type: "simple-fill",
                    color: [252,174,145, 0.7],
                    style: "solid",
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "251 to 750"
            }, {
                minValue: 751,
                maxValue: 1450,
                symbol: {
                    type: "simple-fill",
                    color: [251,106,74, 0.7],
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "751 to 1,450"
            }, {
                minValue: 1451,
                maxValue: 2550,
                symbol: {
                    type: "simple-fill",
                    color: [222,45,38, 0.7],
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "1,451 to 2,550"
            }, {
                minValue: 2551,
                maxValue: 100000,
                symbol: {
                    type: "simple-fill",
                    color: [165,15,21, 0.7],
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "Greater than 2,550"
            }
        ]
    };

    var jTazRenderer2018 = {
        type: "class-breaks",
        field: "Jobs_2018",
        legendOptions: {
            title: "2018 - Jobs"
        },
        defaultSymbol: {
            type: "simple-fill",
            color: "black",
            style: "backward-diagonal",
            outline: {
                width: 0.5,
                color: [50, 50, 50, 0.6]
            }
        },
        defaultLabel: "no data",
        classBreakInfos: [
            {
                minValue: 0,
                maxValue: 500,
                symbol: {
                    type: "simple-fill",
                    color: [254,229,217, 0.7],
                    style: "solid",
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "0 to 500"
            }, {
                minValue: 501,
                maxValue: 1500,
                symbol: {
                    type: "simple-fill",
                    color: [252,174,145, 0.7],
                    style: "solid",
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "501 to 1,500"
            }, {
                minValue: 1501,
                maxValue: 4500,
                symbol: {
                    type: "simple-fill",
                    color: [251,106,74, 0.7],
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "1,501 to 4,500"
            }, {
                minValue: 4501,
                maxValue: 10000,
                symbol: {
                    type: "simple-fill",
                    color: [222,45,38, 0.7],
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "4,501 to 10,000"
            }, {
                minValue: 10001,
                maxValue: 100000,
                symbol: {
                    type: "simple-fill",
                    color: [165,15,21, 0.7],
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "Greater than 10,000"
            }
        ]
    };

    var jTazRenderer2025 = {
        type: "class-breaks",
        field: "Jobs_2025",
        legendOptions: {
            title: "2025 - Jobs"
        },
        defaultSymbol: {
            type: "simple-fill",
            color: "black",
            style: "backward-diagonal",
            outline: {
                width: 0.5,
                color: [50, 50, 50, 0.6]
            }
        },
        defaultLabel: "no data",
        classBreakInfos: [
            {
                minValue: 0,
                maxValue: 500,
                symbol: {
                    type: "simple-fill",
                    color: [254,229,217, 0.7],
                    style: "solid",
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "0 to 500"
            }, {
                minValue: 501,
                maxValue: 1500,
                symbol: {
                    type: "simple-fill",
                    color: [252,174,145, 0.7],
                    style: "solid",
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "501 to 1,500"
            }, {
                minValue: 1501,
                maxValue: 4500,
                symbol: {
                    type: "simple-fill",
                    color: [251,106,74, 0.7],
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "1,501 to 4,500"
            }, {
                minValue: 4501,
                maxValue: 10000,
                symbol: {
                    type: "simple-fill",
                    color: [222,45,38, 0.7],
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "4,501 to 10,000"
            }, {
                minValue: 10001,
                maxValue: 100000,
                symbol: {
                    type: "simple-fill",
                    color: [165,15,21, 0.7],
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "Greater than 10,000"
            }
        ]
    };

    var jTazRenderer2035 = {
        type: "class-breaks",
        field: "Jobs_2035",
        legendOptions: {
            title: "2035 - Jobs"
        },
        defaultSymbol: {
            type: "simple-fill",
            color: "black",
            style: "backward-diagonal",
            outline: {
                width: 0.5,
                color: [50, 50, 50, 0.6]
            }
        },
        defaultLabel: "no data",
        classBreakInfos: [
            {
                minValue: 0,
                maxValue: 500,
                symbol: {
                    type: "simple-fill",
                    color: [254,229,217, 0.7],
                    style: "solid",
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "0 to 500"
            }, {
                minValue: 501,
                maxValue: 1500,
                symbol: {
                    type: "simple-fill",
                    color: [252,174,145, 0.7],
                    style: "solid",
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "501 to 1,500"
            }, {
                minValue: 1501,
                maxValue: 4500,
                symbol: {
                    type: "simple-fill",
                    color: [251,106,74, 0.7],
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "1,501 to 4,500"
            }, {
                minValue: 4501,
                maxValue: 10000,
                symbol: {
                    type: "simple-fill",
                    color: [222,45,38, 0.7],
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "4,501 to 10,000"
            }, {
                minValue: 10001,
                maxValue: 100000,
                symbol: {
                    type: "simple-fill",
                    color: [165,15,21, 0.7],
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "Greater than 10,000"
            }
        ]
    };

    var jTazRenderer2045 = {
        type: "class-breaks",
        field: "Jobs_2045",
        legendOptions: {
            title: "2045 - Jobs"
        },
        defaultSymbol: {
            type: "simple-fill",
            color: "black",
            style: "backward-diagonal",
            outline: {
                width: 0.5,
                color: [50, 50, 50, 0.6]
            }
        },
        defaultLabel: "no data",
        classBreakInfos: [
            {
                minValue: 0,
                maxValue: 500,
                symbol: {
                    type: "simple-fill",
                    color: [254,229,217, 0.7],
                    style: "solid",
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "0 to 500"
            }, {
                minValue: 501,
                maxValue: 1500,
                symbol: {
                    type: "simple-fill",
                    color: [252,174,145, 0.7],
                    style: "solid",
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "501 to 1,500"
            }, {
                minValue: 1501,
                maxValue: 4500,
                symbol: {
                    type: "simple-fill",
                    color: [251,106,74, 0.7],
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "1,501 to 4,500"
            }, {
                minValue: 4501,
                maxValue: 10000,
                symbol: {
                    type: "simple-fill",
                    color: [222,45,38, 0.7],
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "4,501 to 10,000"
            }, {
                minValue: 10001,
                maxValue: 100000,
                symbol: {
                    type: "simple-fill",
                    color: [165,15,21, 0.7],
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "Greater than 10,000"
            }
        ]
    };

    var hpTazGrowth = {
        type: "class-breaks",
        field: "HouseholdPopulation_Growth",
        legendOptions: {
            title: "2018-2045 Population Growth"
        },
        defaultSymbol: {
            type: "simple-fill",
            color: "black",
            style: "backward-diagonal",
            outline: {
                width: 0.5,
                color: [50, 50, 50, 0.6]
            }
        },
        defaultLabel: "no data",
        classBreakInfos: [
            {
                minValue: -4000,
                maxValue: 1000,
                symbol: {
                    type: "simple-fill",
                    color: [254,229,217, 0.7],
                    style: "solid",
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "0 to 1,000"
            }, {
                minValue: 1001,
                maxValue: 3500,
                symbol: {
                    type: "simple-fill",
                    color: [252,174,145, 0.7],
                    style: "solid",
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "1,001 to 3,500"
            }, {
                minValue: 3501,
                maxValue: 7000,
                symbol: {
                    type: "simple-fill",
                    color: [251,106,74, 0.7],
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "3,501 to 7,000"
            }, {
                minValue: 7001,
                maxValue: 12000,
                symbol: {
                    type: "simple-fill",
                    color: [222,45,38, 0.7],
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "7,001 to 12,000"
            }, {
                minValue: 12001,
                maxValue: 500000,
                symbol: {
                    type: "simple-fill",
                    color: [165,15,21, 0.7],
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "Greater than 12,000"
            }
        ]
    };

    var hhTazGrowth = {
        type: "class-breaks",
        field: "Household_Growth",
        legendOptions: {
            title: "2018-2045 Household Growth"
        },
        defaultSymbol: {
            type: "simple-fill",
            color: "black",
            style: "backward-diagonal",
            outline: {
                width: 0.5,
                color: [50, 50, 50, 0.6]
            }
        },
        defaultLabel: "no data",
        classBreakInfos: [
            {
                minValue: -4000,
                maxValue: 500,
                symbol: {
                    type: "simple-fill",
                    color: [254,229,217, 0.7],
                    style: "solid",
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "0 to 500"
            }, {
                minValue: 501,
                maxValue: 1500,
                symbol: {
                    type: "simple-fill",
                    color: [252,174,145, 0.7],
                    style: "solid",
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "501 to 1,500"
            }, {
                minValue: 1501,
                maxValue: 3000,
                symbol: {
                    type: "simple-fill",
                    color: [251,106,74, 0.7],
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "1,501 to 3,000"
            }, {
                minValue: 3001,
                maxValue: 5500,
                symbol: {
                    type: "simple-fill",
                    color: [222,45,38, 0.7],
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "3,001 to 5,500"
            }, {
                minValue: 5501,
                maxValue: 500000,
                symbol: {
                    type: "simple-fill",
                    color: [165,15,21, 0.7],
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "Greater than 5,500"
            }
        ]
    };

    var jTazGrowth = {
        type: "class-breaks",
        field: "Job_Growth",
        legendOptions: {
            title: "2018-2045 Job Growth"
        },
        defaultSymbol: {
            type: "simple-fill",
            color: "black",
            style: "backward-diagonal",
            outline: {
                width: 0.5,
                color: [50, 50, 50, 0.6]
            }
        },
        defaultLabel: "no data",
        classBreakInfos: [
            {
                minValue: -4000,
                maxValue: 250,
                symbol: {
                    type: "simple-fill",
                    color: [254,229,217, 0.7],
                    style: "solid",
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "0 to 250"
            }, {
                minValue: 251,
                maxValue: 1000,
                symbol: {
                    type: "simple-fill",
                    color: [252,174,145, 0.7],
                    style: "solid",
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "251 to 1,000"
            }, {
                minValue: 1001,
                maxValue: 3000,
                symbol: {
                    type: "simple-fill",
                    color: [251,106,74, 0.7],
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "1,001 to 3,000"
            }, {
                minValue: 3001,
                maxValue: 10000,
                symbol: {
                    type: "simple-fill",
                    color: [222,45,38, 0.7],
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "3,001 to 10,000"
            }, {
                minValue: 10001,
                maxValue: 500000,
                symbol: {
                    type: "simple-fill",
                    color: [165,15,21, 0.7],
                    outline: {
                        width: 1,
                        color: [0,0,0, 0.3]
                    }
                },
                label: "Greater than 10,000"
            }
        ]
    };

    //Grid renderers
    var hpGridRenderer2018 = {
        type: "class-breaks",
        field: "Household_Population_2018",
        legendOptions: {
            title: "2018 - Household Population"
        },
        defaultSymbol: {
            type: "simple-fill",
            color: "black",
            style: "backward-diagonal",
            outline: {
                width: 0.5,
                color: [50, 50, 50, 0.6]
            }
        },
        defaultLabel: "no data",
        classBreakInfos: [
            {
                minValue: 0,
                maxValue: 2000,
                symbol: {
                    type: "simple-fill",
                    color: [26,150,65, 0.7],
                    style: "solid",
                    outline: {
                        width: 1,
                        color: [0,0,0, 0]
                    }
                },
                label: "0 to 2,000"
            }, {
                minValue: 2001,
                maxValue: 5000,
                symbol: {
                    type: "simple-fill",
                    color: [166,217,106, 0.7],
                    style: "solid",
                    outline: {
                        width: 1,
                        color: [0,0,0, 0]
                    }
                },
                label: "2,001 to 5,000"
            }, {
                minValue: 5001,
                maxValue: 10000,
                symbol: {
                    type: "simple-fill",
                    color: [255,255,191, 0.7],
                    outline: {
                        width: 1,
                        color: [0,0,0, 0]
                    }
                },
                label: "5,001 to 10,000"
            }, {
                minValue: 10001,
                maxValue: 25000,
                symbol: {
                    type: "simple-fill",
                    color: [253,174,97, 0.7],
                    outline: {
                        width: 1,
                        color: [0,0,0, 0]
                    }
                },
                label: "10,001 to 25,000"
            }, {
                minValue: 25001,
                maxValue: 100000,
                symbol: {
                    type: "simple-fill",
                    color: [215,25,28, 0.7],
                    outline: {
                        width: 1,
                        color: [0,0,0, 0]
                    }
                },
                label: "Greater than 25,000"
            }
        ]
    };

    var hpGridRenderer2025 = {
        type: "class-breaks",
        field: "Household_Population_2025",
        legendOptions: {
            title: "2025 - Household Population"
        },
        defaultSymbol: {
            type: "simple-fill",
            color: "black",
            style: "backward-diagonal",
            outline: {
                width: 0.5,
                color: [50, 50, 50, 0.6]
            }
        },
        defaultLabel: "no data",
        classBreakInfos: [
            {
                minValue: 0,
                maxValue: 2000,
                symbol: {
                    type: "simple-fill",
                    color: [26,150,65, 0.7],
                    style: "solid",
                    outline: {
                        width: 1,
                        color: [0,0,0, 0]
                    }
                },
                label: "0 to 2,000"
            }, {
                minValue: 2001,
                maxValue: 5000,
                symbol: {
                    type: "simple-fill",
                    color: [166,217,106, 0.7],
                    style: "solid",
                    outline: {
                        width: 1,
                        color: [0,0,0, 0]
                    }
                },
                label: "2,001 to 5,000"
            }, {
                minValue: 5001,
                maxValue: 10000,
                symbol: {
                    type: "simple-fill",
                    color: [255,255,191, 0.7],
                    outline: {
                        width: 1,
                        color: [0,0,0, 0]
                    }
                },
                label: "5,001 to 10,000"
            }, {
                minValue: 10001,
                maxValue: 25000,
                symbol: {
                    type: "simple-fill",
                    color: [253,174,97, 0.7],
                    outline: {
                        width: 1,
                        color: [0,0,0, 0]
                    }
                },
                label: "10,001 to 25,000"
            }, {
                minValue: 25001,
                maxValue: 100000,
                symbol: {
                    type: "simple-fill",
                    color: [215,25,28, 0.7],
                    outline: {
                        width: 1,
                        color: [0,0,0, 0]
                    }
                },
                label: "Greater than 25,000"
            }
        ]
    };

    var hpGridRenderer2035 = {
        type: "class-breaks",
        field: "Household_Population_2035",
        legendOptions: {
            title: "2035 - Household Population"
        },
        defaultSymbol: {
            type: "simple-fill",
            color: "black",
            style: "backward-diagonal",
            outline: {
                width: 0.5,
                color: [50, 50, 50, 0.6]
            }
        },
        defaultLabel: "no data",
        classBreakInfos: [
            {
                minValue: 0,
                maxValue: 2000,
                symbol: {
                    type: "simple-fill",
                    color: [26,150,65, 0.7],
                    style: "solid",
                    outline: {
                        width: 1,
                        color: [0,0,0, 0]
                    }
                },
                label: "0 to 2,000"
            }, {
                minValue: 2001,
                maxValue: 5000,
                symbol: {
                    type: "simple-fill",
                    color: [166,217,106, 0.7],
                    style: "solid",
                    outline: {
                        width: 1,
                        color: [0,0,0, 0]
                    }
                },
                label: "2,001 to 5,000"
            }, {
                minValue: 5001,
                maxValue: 10000,
                symbol: {
                    type: "simple-fill",
                    color: [255,255,191, 0.7],
                    outline: {
                        width: 1,
                        color: [0,0,0, 0]
                    }
                },
                label: "5,001 to 10,000"
            }, {
                minValue: 10001,
                maxValue: 25000,
                symbol: {
                    type: "simple-fill",
                    color: [253,174,97, 0.7],
                    outline: {
                        width: 1,
                        color: [0,0,0, 0]
                    }
                },
                label: "10,001 to 25,000"
            }, {
                minValue: 25001,
                maxValue: 100000,
                symbol: {
                    type: "simple-fill",
                    color: [215,25,28, 0.7],
                    outline: {
                        width: 1,
                        color: [0,0,0, 0]
                    }
                },
                label: "Greater than 25,000"
            }
        ]
    };

    var hpGridRenderer2045 = {
        type: "class-breaks",
        field: "Household_Population_2045",
        legendOptions: {
            title: "2045 - Household Population"
        },
        defaultSymbol: {
            type: "simple-fill",
            color: "black",
            style: "backward-diagonal",
            outline: {
                width: 0.5,
                color: [50, 50, 50, 0.6]
            }
        },
        defaultLabel: "no data",
        classBreakInfos: [
            {
                minValue: 0,
                maxValue: 2000,
                symbol: {
                    type: "simple-fill",
                    color: [26,150,65, 0.7],
                    style: "solid",
                    outline: {
                        width: 1,
                        color: [0,0,0, 0]
                    }
                },
                label: "0 to 2,000"
            }, {
                minValue: 2001,
                maxValue: 5000,
                symbol: {
                    type: "simple-fill",
                    color: [166,217,106, 0.7],
                    style: "solid",
                    outline: {
                        width: 1,
                        color: [0,0,0, 0]
                    }
                },
                label: "2,001 to 5,000"
            }, {
                minValue: 5001,
                maxValue: 10000,
                symbol: {
                    type: "simple-fill",
                    color: [255,255,191, 0.7],
                    outline: {
                        width: 1,
                        color: [0,0,0, 0]
                    }
                },
                label: "5,001 to 10,000"
            }, {
                minValue: 10001,
                maxValue: 25000,
                symbol: {
                    type: "simple-fill",
                    color: [253,174,97, 0.7],
                    outline: {
                        width: 1,
                        color: [0,0,0, 0]
                    }
                },
                label: "10,001 to 25,000"
            }, {
                minValue: 25001,
                maxValue: 100000,
                symbol: {
                    type: "simple-fill",
                    color: [215,25,28, 0.7],
                    outline: {
                        width: 1,
                        color: [0,0,0, 0]
                    }
                },
                label: "Greater than 25,000"
            }
        ]
    };

    var hhGridRenderer2018 = {
        type: "class-breaks",
        field: "Households_2018",
        legendOptions: {
            title: "2018 - Households"
        },
        defaultSymbol: {
            type: "simple-fill",
            color: "black",
            style: "backward-diagonal",
            outline: {
                width: 0.5,
                color: [50, 50, 50, 0.6]
            }
        },
        defaultLabel: "no data",
        classBreakInfos: [
            {
                minValue: 0,
                maxValue: 1000,
                symbol: {
                    type: "simple-fill",
                    color: [26,150,65, 0.7],
                    style: "solid",
                    outline: {
                        width: 1,
                        color: [0,0,0, 0]
                    }
                },
                label: "0 to 1,000"
            }, {
                minValue: 1001,
                maxValue: 3500,
                symbol: {
                    type: "simple-fill",
                    color: [166,217,106, 0.7],
                    style: "solid",
                    outline: {
                        width: 1,
                        color: [0,0,0, 0]
                    }
                },
                label: "1,001 to 3,500"
            }, {
                minValue: 3501,
                maxValue: 6000,
                symbol: {
                    type: "simple-fill",
                    color: [255,255,191, 0.7],
                    outline: {
                        width: 1,
                        color: [0,0,0, 0]
                    }
                },
                label: "3,501 to 6,000"
            }, {
                minValue: 6001,
                maxValue: 8500,
                symbol: {
                    type: "simple-fill",
                    color: [253,174,97, 0.7],
                    outline: {
                        width: 1,
                        color: [0,0,0, 0]
                    }
                },
                label: "6,001 to 8,500"
            }, {
                minValue: 8501,
                maxValue: 100000,
                symbol: {
                    type: "simple-fill",
                    color: [215,25,28, 0.7],
                    outline: {
                        width: 1,
                        color: [0,0,0, 0]
                    }
                },
                label: "Greater than 8,500"
            }
        ]
    };

    var hhGridRenderer2025 = {
        type: "class-breaks",
        field: "Households_2025",
        legendOptions: {
            title: "2025 - Households"
        },
        defaultSymbol: {
            type: "simple-fill",
            color: "black",
            style: "backward-diagonal",
            outline: {
                width: 0.5,
                color: [50, 50, 50, 0.6]
            }
        },
        defaultLabel: "no data",
        classBreakInfos: [
            {
                minValue: 0,
                maxValue: 1000,
                symbol: {
                    type: "simple-fill",
                    color: [26,150,65, 0.7],
                    style: "solid",
                    outline: {
                        width: 1,
                        color: [0,0,0, 0]
                    }
                },
                label: "0 to 1,000"
            }, {
                minValue: 1001,
                maxValue: 3500,
                symbol: {
                    type: "simple-fill",
                    color: [166,217,106, 0.7],
                    style: "solid",
                    outline: {
                        width: 1,
                        color: [0,0,0, 0]
                    }
                },
                label: "1,001 to 3,500"
            }, {
                minValue: 3501,
                maxValue: 6000,
                symbol: {
                    type: "simple-fill",
                    color: [255,255,191, 0.7],
                    outline: {
                        width: 1,
                        color: [0,0,0, 0]
                    }
                },
                label: "3,501 to 6,000"
            }, {
                minValue: 6001,
                maxValue: 8500,
                symbol: {
                    type: "simple-fill",
                    color: [253,174,97, 0.7],
                    outline: {
                        width: 1,
                        color: [0,0,0, 0]
                    }
                },
                label: "6,001 to 8,500"
            }, {
                minValue: 8501,
                maxValue: 100000,
                symbol: {
                    type: "simple-fill",
                    color: [215,25,28, 0.7],
                    outline: {
                        width: 1,
                        color: [0,0,0, 0]
                    }
                },
                label: "Greater than 8,500"
            }
        ]
    };

    var hhGridRenderer2035 = {
        type: "class-breaks",
        field: "Households_2035",
        legendOptions: {
            title: "2035 - Households"
        },
        defaultSymbol: {
            type: "simple-fill",
            color: "black",
            style: "backward-diagonal",
            outline: {
                width: 0.5,
                color: [50, 50, 50, 0.6]
            }
        },
        defaultLabel: "no data",
        classBreakInfos: [
            {
                minValue: 0,
                maxValue: 1000,
                symbol: {
                    type: "simple-fill",
                    color: [26,150,65, 0.7],
                    style: "solid",
                    outline: {
                        width: 1,
                        color: [0,0,0, 0]
                    }
                },
                label: "0 to 1,000"
            }, {
                minValue: 1001,
                maxValue: 3500,
                symbol: {
                    type: "simple-fill",
                    color: [166,217,106, 0.7],
                    style: "solid",
                    outline: {
                        width: 1,
                        color: [0,0,0, 0]
                    }
                },
                label: "1,001 to 3,500"
            }, {
                minValue: 3501,
                maxValue: 6000,
                symbol: {
                    type: "simple-fill",
                    color: [255,255,191, 0.7],
                    outline: {
                        width: 1,
                        color: [0,0,0, 0]
                    }
                },
                label: "3,501 to 6,000"
            }, {
                minValue: 6001,
                maxValue: 8500,
                symbol: {
                    type: "simple-fill",
                    color: [253,174,97, 0.7],
                    outline: {
                        width: 1,
                        color: [0,0,0, 0]
                    }
                },
                label: "6,001 to 8,500"
            }, {
                minValue: 8501,
                maxValue: 100000,
                symbol: {
                    type: "simple-fill",
                    color: [215,25,28, 0.7],
                    outline: {
                        width: 1,
                        color: [0,0,0, 0]
                    }
                },
                label: "Greater than 8,500"
            }
        ]
    };

    var hhGridRenderer2045 = {
        type: "class-breaks",
        field: "Households_2045",
        legendOptions: {
            title: "2045 - Households"
        },
        defaultSymbol: {
            type: "simple-fill",
            color: "black",
            style: "backward-diagonal",
            outline: {
                width: 0.5,
                color: [50, 50, 50, 0.6]
            }
        },
        defaultLabel: "no data",
        classBreakInfos: [
            {
                minValue: 0,
                maxValue: 1000,
                symbol: {
                    type: "simple-fill",
                    color: [26,150,65, 0.7],
                    style: "solid",
                    outline: {
                        width: 1,
                        color: [0,0,0, 0]
                    }
                },
                label: "0 to 1,000"
            }, {
                minValue: 1001,
                maxValue: 3500,
                symbol: {
                    type: "simple-fill",
                    color: [166,217,106, 0.7],
                    style: "solid",
                    outline: {
                        width: 1,
                        color: [0,0,0, 0]
                    }
                },
                label: "1,001 to 3,500"
            }, {
                minValue: 3501,
                maxValue: 6000,
                symbol: {
                    type: "simple-fill",
                    color: [255,255,191, 0.7],
                    outline: {
                        width: 1,
                        color: [0,0,0, 0]
                    }
                },
                label: "3,501 to 6,000"
            }, {
                minValue: 6001,
                maxValue: 8500,
                symbol: {
                    type: "simple-fill",
                    color: [253,174,97, 0.7],
                    outline: {
                        width: 1,
                        color: [0,0,0, 0]
                    }
                },
                label: "6,001 to 8,500"
            }, {
                minValue: 8501,
                maxValue: 100000,
                symbol: {
                    type: "simple-fill",
                    color: [215,25,28, 0.7],
                    outline: {
                        width: 1,
                        color: [0,0,0, 0]
                    }
                },
                label: "Greater than 8,500"
            }
        ]
    };

    var jGridRenderer2018 = {
        type: "class-breaks",
        field: "Jobs_2018",
        legendOptions: {
            title: "2018 - Jobs"
        },
        defaultSymbol: {
            type: "simple-fill",
            color: "black",
            style: "backward-diagonal",
            outline: {
                width: 0.5,
                color: [50, 50, 50, 0.6]
            }
        },
        defaultLabel: "no data",
        classBreakInfos: [
            {
                minValue: 0,
                maxValue: 3000,
                symbol: {
                    type: "simple-fill",
                    color: [26,150,65, 0.7],
                    style: "solid",
                    outline: {
                        width: 1,
                        color: [0,0,0, 0]
                    }
                },
                label: "0 to 3,000"
            }, {
                minValue: 3001,
                maxValue: 10000,
                symbol: {
                    type: "simple-fill",
                    color: [166,217,106, 0.7],
                    style: "solid",
                    outline: {
                        width: 1,
                        color: [0,0,0, 0]
                    }
                },
                label: "3,001 to 10,000"
            }, {
                minValue: 10001,
                maxValue: 25000,
                symbol: {
                    type: "simple-fill",
                    color: [255,255,191, 0.7],
                    outline: {
                        width: 1,
                        color: [0,0,0, 0]
                    }
                },
                label: "10,001 to 25,000"
            }, {
                minValue: 25001,
                maxValue: 50000,
                symbol: {
                    type: "simple-fill",
                    color: [253,174,97, 0.7],
                    outline: {
                        width: 1,
                        color: [0,0,0, 0]
                    }
                },
                label: "25,001 to 50,000"
            }, {
                minValue: 50001,
                maxValue: 500000,
                symbol: {
                    type: "simple-fill",
                    color: [215,25,28, 0.7],
                    outline: {
                        width: 1,
                        color: [0,0,0, 0]
                    }
                },
                label: "Greater than 50,000"
            }
        ]
    };

    var jGridRenderer2025 = {
        type: "class-breaks",
        field: "Jobs_2025",
        legendOptions: {
            title: "2025 - Jobs"
        },
        defaultSymbol: {
            type: "simple-fill",
            color: "black",
            style: "backward-diagonal",
            outline: {
                width: 0.5,
                color: [50, 50, 50, 0.6]
            }
        },
        defaultLabel: "no data",
        classBreakInfos: [
            {
                minValue: 0,
                maxValue: 3000,
                symbol: {
                    type: "simple-fill",
                    color: [26,150,65, 0.7],
                    style: "solid",
                    outline: {
                        width: 1,
                        color: [0,0,0, 0]
                    }
                },
                label: "0 to 3,000"
            }, {
                minValue: 3001,
                maxValue: 10000,
                symbol: {
                    type: "simple-fill",
                    color: [166,217,106, 0.7],
                    style: "solid",
                    outline: {
                        width: 1,
                        color: [0,0,0, 0]
                    }
                },
                label: "3,001 to 10,000"
            }, {
                minValue: 10001,
                maxValue: 25000,
                symbol: {
                    type: "simple-fill",
                    color: [255,255,191, 0.7],
                    outline: {
                        width: 1,
                        color: [0,0,0, 0]
                    }
                },
                label: "10,001 to 25,000"
            }, {
                minValue: 25001,
                maxValue: 50000,
                symbol: {
                    type: "simple-fill",
                    color: [253,174,97, 0.7],
                    outline: {
                        width: 1,
                        color: [0,0,0, 0]
                    }
                },
                label: "25,001 to 50,000"
            }, {
                minValue: 50001,
                maxValue: 500000,
                symbol: {
                    type: "simple-fill",
                    color: [215,25,28, 0.7],
                    outline: {
                        width: 1,
                        color: [0,0,0, 0]
                    }
                },
                label: "Greater than 50,000"
            }
        ]
    };

    var jGridRenderer2035 = {
        type: "class-breaks",
        field: "Jobs_2035",
        legendOptions: {
            title: "2035 - Jobs"
        },
        defaultSymbol: {
            type: "simple-fill",
            color: "black",
            style: "backward-diagonal",
            outline: {
                width: 0.5,
                color: [50, 50, 50, 0.6]
            }
        },
        defaultLabel: "no data",
        classBreakInfos: [
            {
                minValue: 0,
                maxValue: 3000,
                symbol: {
                    type: "simple-fill",
                    color: [26,150,65, 0.7],
                    style: "solid",
                    outline: {
                        width: 1,
                        color: [0,0,0, 0]
                    }
                },
                label: "0 to 3,000"
            }, {
                minValue: 3001,
                maxValue: 10000,
                symbol: {
                    type: "simple-fill",
                    color: [166,217,106, 0.7],
                    style: "solid",
                    outline: {
                        width: 1,
                        color: [0,0,0, 0]
                    }
                },
                label: "3,001 to 10,000"
            }, {
                minValue: 10001,
                maxValue: 25000,
                symbol: {
                    type: "simple-fill",
                    color: [255,255,191, 0.7],
                    outline: {
                        width: 1,
                        color: [0,0,0, 0]
                    }
                },
                label: "10,001 to 25,000"
            }, {
                minValue: 25001,
                maxValue: 50000,
                symbol: {
                    type: "simple-fill",
                    color: [253,174,97, 0.7],
                    outline: {
                        width: 1,
                        color: [0,0,0, 0]
                    }
                },
                label: "25,001 to 50,000"
            }, {
                minValue: 50001,
                maxValue: 500000,
                symbol: {
                    type: "simple-fill",
                    color: [215,25,28, 0.7],
                    outline: {
                        width: 1,
                        color: [0,0,0, 0]
                    }
                },
                label: "Greater than 50,000"
            }
        ]
    };

    var jGridRenderer2045 = {
        type: "class-breaks",
        field: "Jobs_2045",
        legendOptions: {
            title: "2045 - Jobs"
        },
        defaultSymbol: {
            type: "simple-fill",
            color: "black",
            style: "backward-diagonal",
            outline: {
                width: 0.5,
                color: [50, 50, 50, 0.6]
            }
        },
        defaultLabel: "no data",
        classBreakInfos: [
            {
                minValue: 0,
                maxValue: 3000,
                symbol: {
                    type: "simple-fill",
                    color: [26,150,65, 0.7],
                    style: "solid",
                    outline: {
                        width: 1,
                        color: [0,0,0, 0]
                    }
                },
                label: "0 to 3,000"
            }, {
                minValue: 3001,
                maxValue: 10000,
                symbol: {
                    type: "simple-fill",
                    color: [166,217,106, 0.7],
                    style: "solid",
                    outline: {
                        width: 1,
                        color: [0,0,0, 0]
                    }
                },
                label: "3,001 to 10,000"
            }, {
                minValue: 10001,
                maxValue: 25000,
                symbol: {
                    type: "simple-fill",
                    color: [255,255,191, 0.7],
                    outline: {
                        width: 1,
                        color: [0,0,0, 0]
                    }
                },
                label: "10,001 to 25,000"
            }, {
                minValue: 25001,
                maxValue: 50000,
                symbol: {
                    type: "simple-fill",
                    color: [253,174,97, 0.7],
                    outline: {
                        width: 1,
                        color: [0,0,0, 0]
                    }
                },
                label: "25,001 to 50,000"
            }, {
                minValue: 50001,
                maxValue: 500000,
                symbol: {
                    type: "simple-fill",
                    color: [215,25,28, 0.7],
                    outline: {
                        width: 1,
                        color: [0,0,0, 0]
                    }
                },
                label: "Greater than 50,000"
            }
        ]
    };

    var hpGridGrowth = {
        type: "class-breaks",
        field: "HouseholdPopulation_Growth_Diff",
        legendOptions: {
            title: "2018-2045 Population Growth"
        },
        defaultSymbol: {
            type: "simple-fill",
            color: "black",
            style: "backward-diagonal",
            outline: {
                width: 0.5,
                color: [50, 50, 50, 0.6]
            }
        },
        defaultLabel: "no data",
        classBreakInfos: [
            {
                minValue: -4000,
                maxValue: 1000,
                symbol: {
                    type: "simple-fill",
                    color: [26,150,65, 0.7],
                    style: "solid",
                    outline: {
                        width: 1,
                        color: [0,0,0, 0]
                    }
                },
                label: "0 to 1,000"
            }, {
                minValue: 1001,
                maxValue: 3500,
                symbol: {
                    type: "simple-fill",
                    color: [166,217,106, 0.7],
                    style: "solid",
                    outline: {
                        width: 1,
                        color: [0,0,0, 0]
                    }
                },
                label: "1,001 to 3,500"
            }, {
                minValue: 3501,
                maxValue: 7000,
                symbol: {
                    type: "simple-fill",
                    color: [255,255,191, 0.7],
                    outline: {
                        width: 1,
                        color: [0,0,0, 0]
                    }
                },
                label: "3,501 to 7,000"
            }, {
                minValue: 7001,
                maxValue: 12000,
                symbol: {
                    type: "simple-fill",
                    color: [253,174,97, 0.7],
                    outline: {
                        width: 1,
                        color: [0,0,0, 0]
                    }
                },
                label: "7,001 to 12,000"
            }, {
                minValue: 12001,
                maxValue: 500000,
                symbol: {
                    type: "simple-fill",
                    color: [215,25,28, 0.7],
                    outline: {
                        width: 1,
                        color: [0,0,0, 0]
                    }
                },
                label: "Greater than 12,000"
            }
        ]
    };

    var hhGridGrowth = {
        type: "class-breaks",
        field: "Household_Growth_Difference",
        legendOptions: {
            title: "2018-2045 Household Growth"
        },
        defaultSymbol: {
            type: "simple-fill",
            color: "black",
            style: "backward-diagonal",
            outline: {
                width: 0.5,
                color: [50, 50, 50, 0.6]
            }
        },
        defaultLabel: "no data",
        classBreakInfos: [
            {
                minValue: -10000,
                maxValue: 500,
                symbol: {
                    type: "simple-fill",
                    color: [26,150,65, 0.7],
                    style: "solid",
                    outline: {
                        width: 1,
                        color: [0,0,0, 0]
                    }
                },
                label: "0 to 500"
            }, {
                minValue: 501,
                maxValue: 2000,
                symbol: {
                    type: "simple-fill",
                    color: [166,217,106, 0.7],
                    style: "solid",
                    outline: {
                        width: 1,
                        color: [0,0,0, 0]
                    }
                },
                label: "501 to 2,000"
            }, {
                minValue: 2001,
                maxValue: 5000,
                symbol: {
                    type: "simple-fill",
                    color: [255,255,191, 0.7],
                    outline: {
                        width: 1,
                        color: [0,0,0, 0]
                    }
                },
                label: "2,001 to 5,000"
            }, {
                minValue: 5001,
                maxValue: 10000,
                symbol: {
                    type: "simple-fill",
                    color: [253,174,97, 0.7],
                    outline: {
                        width: 1,
                        color: [0,0,0, 0]
                    }
                },
                label: "5,001 to 10,000"
            }, {
                minValue: 10001,
                maxValue: 500000,
                symbol: {
                    type: "simple-fill",
                    color: [215,25,28, 0.7],
                    outline: {
                        width: 1,
                        color: [0,0,0, 0]
                    }
                },
                label: "Greater than 12,000"
            }
        ]
    };

    var jGridGrowth = {
        type: "class-breaks",
        field: "Job_Growth_Difference",
        legendOptions: {
            title: "2018-2045 Job Growth"
        },
        defaultSymbol: {
            type: "simple-fill",
            color: "black",
            style: "backward-diagonal",
            outline: {
                width: 0.5,
                color: [50, 50, 50, 0.6]
            }
        },
        defaultLabel: "no data",
        classBreakInfos: [
            {
                minValue: -10000,
                maxValue: 1000,
                symbol: {
                    type: "simple-fill",
                    color: [26,150,65, 0.7],
                    style: "solid",
                    outline: {
                        width: 1,
                        color: [0,0,0, 0]
                    }
                },
                label: "0 to 1,000"
            }, {
                minValue: 1001,
                maxValue: 6000,
                symbol: {
                    type: "simple-fill",
                    color: [166,217,106, 0.7],
                    style: "solid",
                    outline: {
                        width: 1,
                        color: [0,0,0, 0]
                    }
                },
                label: "1,001 to 6,000"
            }, {
                minValue: 6001,
                maxValue: 12000,
                symbol: {
                    type: "simple-fill",
                    color: [255,255,191, 0.7],
                    outline: {
                        width: 1,
                        color: [0,0,0, 0]
                    }
                },
                label: "6,001 to 12,000"
            }, {
                minValue: 12001,
                maxValue: 24000,
                symbol: {
                    type: "simple-fill",
                    color: [253,174,97, 0.7],
                    outline: {
                        width: 1,
                        color: [0,0,0, 0]
                    }
                },
                label: "12,001 to 24,000"
            }, {
                minValue: 24001,
                maxValue: 500000,
                symbol: {
                    type: "simple-fill",
                    color: [215,25,28, 0.7],
                    outline: {
                        width: 1,
                        color: [0,0,0, 0]
                    }
                },
                label: "Greater than 24,000"
            }
        ]
    };

    //============================================
    //Add the different layers to the map
    var tracts = new FeatureLayer({
        url: "https://gis.h-gac.com/arcgis/rest/services/Forecast/ForecastVisualization/MapServer/0",
        renderer: hpTractsRenderer2018,
        title: "Census Tracts"
    });
    map.add(tracts);

    var taz = new FeatureLayer({
        url: "https://gis.h-gac.com/arcgis/rest/services/Forecast/ForecastVisualization/MapServer/2",
        visible: false,
        title: "Traffic Analysis Zone (TAZ)"
    });
    map.add(taz);

    var grid = new FeatureLayer({
        url: "https://gis.h-gac.com/arcgis/rest/services/Forecast/ForecastVisualization/MapServer/1",
        visible: false,
        title: "3 Square Mile Grid"
    });
    map.add(grid);

    //===========================================
    //Determine how to symbolize the data
    var fieldDropdown = $("#fieldDropdown").val();
    var yrDropdown = $("#yearDropdown").val();

    $("#fieldDropdown").change(function(){
        fieldDropdown = $("#fieldDropdown").val();
        var layer = $("input:checked").val();
        chooseRenderer(layer, fieldDropdown, yrDropdown);
    });

    $("#yearDropdown").change(function(){
        yrDropdown = $("#yearDropdown").val();
        var selectedLayer = $("input:checked").val();
        chooseRenderer(selectedLayer, fieldDropdown, yrDropdown);
    });

    $("#tractsStyle").click(function(){
        tracts.visible = true;
        taz.visible = false;
        grid.visible = false;

        //Set the renderer for the boundary
        tractsRendererChange(fieldDropdown, yrDropdown);
    });

    $("#tazStyle").click(function(){
        taz.visible = true;
        tracts.visible = false;
        grid.visible = false;

        //Set the renderer for the boundary
        tazRendererChange(fieldDropdown, yrDropdown);
    });

    $("#gridStyle").click(function(){
        grid.visible = true;
        tracts.visible = false;
        taz.visible = false;

        //Set the renderer for the boundary
        gridRendererChange(fieldDropdown, yrDropdown);
    });

    //Function to determine which renderer to use
    function chooseRenderer(layer, field, year){
        if (layer == "tracts"){
            if (field == "Household_Population"){
                if (year == "2018"){
                    tracts.renderer = hpTractsRenderer2018;
                } else if (year == "2025"){
                    tracts.renderer = hpTractsRenderer2025;
                } else if (year == "2035"){
                    tracts.renderer = hpTractsRenderer2035;
                } else if (year == "2045"){
                    tracts.renderer = hpTractsRenderer2045;
                }
            } else if (field == "Households"){
                if (year == "2018"){
                    tracts.renderer = hhTractsRenderer2018;
                } else if (year == "2025"){
                    tracts.renderer = hhTractsRenderer2025;
                } else if (year == "2035"){;
                    tracts.renderer = hhTractsRenderer2035;
                } else if (year == "2045"){
                    tracts.renderer = hhTractsRenderer2045;
                }
            } else if (field == "Jobs"){
                if (year == "2018"){
                    tracts.renderer = jTractsRenderer2018;
                } else if (year == "2025"){
                    tracts.renderer = jTractsRenderer2025;
                } else if (year == "2035"){
                    tracts.renderer = jTractsRenderer2035;
                } else if (year == "2045"){
                    tracts.renderer = jTractsRenderer2045;
                }
            } else if (field == "HouseholdPopulation_Growth_Diff"){
                tracts.renderer = hpTractsGrowth;
            } else if (field == "Household_Growth_Difference"){
                tracts.renderer = hhTractsGrowth;
            } else if (field == "Job_Growth_Difference"){
                tracts.renderer = jTractsGrowth;
            }
        } else if (layer == "taz"){
            if (field == "Household_Population"){
                if (year == "2018"){
                    taz.renderer = hpTazRenderer2018;
                } else if (year == "2025"){
                    taz.renderer = hpTazRenderer2025;
                } else if (year == "2035"){
                    taz.renderer = hpTazRenderer2035;
                } else if (year == "2045"){
                    taz.renderer = hpTazRenderer2045;
                }
            } else if (field == "Households"){
                if (year == "2018"){
                    taz.renderer = hhTazRenderer2018;
                } else if (year == "2025"){
                    taz.renderer = hhTazRenderer2025;
                } else if (year == "2035"){
                    taz.renderer = hhTazRenderer2035;
                } else if (year == "2045"){
                    taz.renderer = hhTazRenderer2045;
                }
            } else if (field == "Jobs"){
                if (year == "2018"){
                    taz.renderer = jTazRenderer2018;
                } else if (year == "2025"){
                    taz.renderer = jTazRenderer2025;
                } else if (year == "2035"){
                    taz.renderer = jTazRenderer2035;
                } else if (year == "2045"){
                    taz.renderer = jTazRenderer2045;
                }
            } else if (field == "HouseholdPopulation_Growth_Diff"){
                taz.renderer = hpTazGrowth;
            } else if (field == "Household_Growth_Difference"){
                taz.renderer = hhTazGrowth;
            } else if (field == "Job_Growth_Difference"){
                taz.renderer = jTazGrowth;
            }
        } else if (layer == "grid"){
            if (field == "Household_Population"){
                if (year == "2018"){
                    grid.renderer = hpGridRenderer2018;
                } else if (year == "2025"){
                    grid.renderer = hpGridRenderer2025;
                } else if (year == "2035"){
                    grid.renderer = hpGridRenderer2035;
                } else if (year == "2045"){
                    grid.renderer = hpGridRenderer2045;
                }
            } else if (field == "Households"){
                if (year == "2018"){
                    grid.renderer = hhGridRenderer2018;
                } else if (year == "2025"){
                    grid.renderer = hhGridRenderer2025;
                } else if (year == "2035"){
                    grid.renderer = hhGridRenderer2035;
                } else if (year == "2045"){
                    grid.renderer = hhGridRenderer2045;
                }
            } else if (field == "Jobs"){
                if (year == "2018"){
                    grid.renderer = jGridRenderer2018;
                } else if (year == "2025"){
                    grid.renderer = jGridRenderer2025;
                } else if (year == "2035"){
                    grid.renderer = jGridRenderer2035;
                } else if (year == "2045"){
                    grid.renderer = jGridRenderer2045;
                }
            } else if (field == "HouseholdPopulation_Growth_Diff"){
                grid.renderer = hpGridGrowth;
            } else if (field == "Household_Growth_Difference"){
                grid.renderer = hhGridGrowth;
            } else if (field == "Job_Growth_Difference"){
                grid.renderer = jGridGrowth;
            }
        }
    }

    //Functions for when the user clicks on the boundary layer buttons
    function tractsRendererChange(field, year){
        if (field == "Household_Population"){
            if (year == "2018"){
                tracts.renderer = hpTractsRenderer2018;
            } else if (year == "2025"){
                tracts.renderer = hpTractsRenderer2025;
            } else if (year == "2035"){
                tracts.renderer = hpTractsRenderer2035;
            } else if (year == "2045"){
                tracts.renderer = hpTractsRenderer2045;
            }
        } else if (field == "Households"){
            if (year == "2018"){
                tracts.renderer = hhTractsRenderer2018;
            } else if (year == "2025"){
                tracts.renderer = hhTractsRenderer2025;
            } else if (year == "2035"){;
                tracts.renderer = hhTractsRenderer2035;
            } else if (year == "2045"){
                tracts.renderer = hhTractsRenderer2045;
            }
        } else if (field == "Jobs"){
            if (year == "2018"){
                tracts.renderer = jTractsRenderer2018;
            } else if (year == "2025"){
                tracts.renderer = jTractsRenderer2025;
            } else if (year == "2035"){
                tracts.renderer = jTractsRenderer2035;
            } else if (year == "2045"){
                tracts.renderer = jTractsRenderer2045;
            }
        } else if (field == "HouseholdPopulation_Growth_Diff"){
            tracts.renderer = hpTractsGrowth;
        } else if (field == "Household_Growth_Difference"){
            tracts.renderer = hhTractsGrowth;
        } else if (field == "Job_Growth_Difference"){
            tracts.renderer = jTractsGrowth;
        }
    }

    function tazRendererChange(field, year){
        if (field == "Household_Population"){
            if (year == "2018"){
                taz.renderer = hpTazRenderer2018;
            } else if (year == "2025"){
                taz.renderer = hpTazRenderer2025;
            } else if (year == "2035"){
                taz.renderer = hpTazRenderer2035;
            } else if (year == "2045"){
                taz.renderer = hpTazRenderer2045;
            }
        } else if (field == "Households"){
            if (year == "2018"){
                taz.renderer = hhTazRenderer2018;
            } else if (year == "2025"){
                taz.renderer = hhTazRenderer2025;
            } else if (year == "2035"){;
                taz.renderer = hhTazRenderer2035;
            } else if (year == "2045"){
                taz.renderer = hhTazRenderer2045;
            }
        } else if (field == "Jobs"){
            if (year == "2018"){
                taz.renderer = jTazRenderer2018;
            } else if (year == "2025"){
                taz.renderer = jTazRenderer2025;
            } else if (year == "2035"){
                taz.renderer = jTazRenderer2035;
            } else if (year == "2045"){
                taz.renderer = jTazRenderer2045;
            }
        } else if (field == "HouseholdPopulation_Growth_Diff"){
            taz.renderer = hpTazGrowth;
        } else if (field == "Household_Growth_Difference"){
            taz.renderer = hhTazGrowth;
        } else if (field == "Job_Growth_Difference"){
            taz.renderer = jTazGrowth;
        }
    }

    function gridRendererChange(field, year){
        if (field == "Household_Population"){
            if (year == "2018"){
                grid.renderer = hpGridRenderer2018;
            } else if (year == "2025"){
                grid.renderer = hpGridRenderer2025;
            } else if (year == "2035"){
                grid.renderer = hpGridRenderer2035;
            } else if (year == "2045"){
                grid.renderer = hpGridRenderer2045;
            }
        } else if (field == "Households"){
            if (year == "2018"){
                grid.renderer = hhGridRenderer2018;
            } else if (year == "2025"){
                grid.renderer = hhGridRenderer2025;
            } else if (year == "2035"){;
                grid.renderer = hhGridRenderer2035;
            } else if (year == "2045"){
                grid.renderer = hhGridRenderer2045;
            }
        } else if (field == "Jobs"){
            if (year == "2018"){
                grid.renderer = jGridRenderer2018;
            } else if (year == "2025"){
                grid.renderer = jGridRenderer2025;
            } else if (year == "2035"){
                grid.renderer = jGridRenderer2035;
            } else if (year == "2045"){
                grid.renderer = jGridRenderer2045;
            }
        } else if (field == "HouseholdPopulation_Growth_Diff"){
            grid.renderer = hpGridGrowth;
        } else if (field == "Household_Growth_Difference"){
            grid.renderer = hhGridGrowth;
        } else if (field == "Job_Growth_Difference"){
            grid.renderer = jGridGrowth;
        }
    }

    //Functions to create the graphs on for the popups
    view.on("click", function(event){
        // if ($("input:checked").val() === "tracts"){
        //     executeTractQueryTask(event.mapPoint);
        // }
        var graphLayer = $("input:checked").val();
        chooseQueryTask(graphLayer, event.mapPoint);
    });

    $("#reportModal").on("hidden.bs.modal", function(){
        $("#Population_chart").remove();
        $("#Household_chart").remove();
        $("#Job_chart").remove();
    });

    function chooseQueryTask(layer, point){
        var query = {
            geometry: point,
            outFields: ["*"],
            returnGeometry: false
        };

        if (layer === "tracts"){
            tracts.queryFeatures(query).then(function(result){
                setPopulationInfo(result.features["0"].attributes);
                setHouseholdInfo(result.features["0"].attributes);
                setJobInfo(result.features["0"].attributes);
            });

            $("#reportModal").modal("show");

        } else if (layer === "taz"){
            taz.queryFeatures(query).then(function(result){
                setPopulationInfo(result.features["0"].attributes);
                setHouseholdInfo(result.features["0"].attributes);
                setJobInfo(result.features["0"].attributes);
            });

            $("#reportModal").modal("show");
            
        } else if (layer === "grid"){
            grid.queryFeatures(query).then(function(result){
                setPopulationInfo(result.features["0"].attributes);
                setHouseholdInfo(result.features["0"].attributes);
                setJobInfo(result.features["0"].attributes);
            });

            $("#reportModal").modal("show");
            
        }
    }

    //Function to create the chart
    function setPopulationInfo(results){
        $("#Population").append("<canvas id='Population_chart'></canvas>");
        var canvas = $("#Population_chart");

        var data = {
            datasets: [
                {
                    data: [results.Household_Population_2018, results.Household_Population_2025, results.Household_Population_2035, results.Household_Population_2045],
                    backgroundColor: ["#d73347"],
                    borderColor: "#d73347",
                    fill: false,
                    label: "Household Population",
                    pointBackgroundColor: "#d73347"
                }
            ],
            labels: ["2018", "2025", "2035", "2045"]
        };

        myChart = new Chart(canvas,{
            type: "line",
            data: data,
            options: {
                // responsive: true,
                tooltips: {
                    mode: "index",
                    intersect: false
                },
                hover: {
                    mode: "nearest",
                    intersect: true
                },
                scales:{
                    xAxes: [{
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: "Year"
                        }
                    }],
                    yAxes: [{
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: "Household Population"
                        },
                        ticks: {
                            callback: function(value){
                                return parseFloat(value).toLocaleString();
                            }
                        }
                    }]
                }
            }
        });

        return canvas;
    }

    function setHouseholdInfo(results){
        $("#Household").append("<canvas id='Household_chart'></canvas>");
        var canvas = $("#Household_chart");

        var data = {
            datasets: [
                {
                    data: [results.Households_2018, results.Households_2025, results.Households_2035, results.Households_2045],
                    backgroundColor: ["#d73347"],
                    borderColor: "#d73347",
                    fill: false,
                    label: "Number of Households",
                    pointBackgroundColor: "#d73347"
                }
            ],
            labels: ["2018", "2025", "2035", "2045"]
        };

        myChart = new Chart(canvas,{
            type: "line",
            data: data,
            options: {
                tooltips: {
                    mode: "index",
                    intersect: false
                },
                hover: {
                    mode: "nearest",
                    intersect: true
                },
                scales:{
                    xAxes: [{
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: "Year"
                        }
                    }],
                    yAxes: [{
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: "Number of Households"
                        },
                        ticks: {
                            callback: function(value){
                                return parseFloat(value).toLocaleString();
                            }
                        }
                    }]
                }
            }
        });

        return canvas;
    }

    function setJobInfo(results){
        $("#Job").append("<canvas id='Job_chart'></canvas>");
        var canvas = $("#Job_chart");

        var data = {
            datasets: [
                {
                    data: [results.Jobs_2018, results.Jobs_2025, results.Jobs_2035, results.Jobs_2045],
                    backgroundColor: ["#d73347"],
                    borderColor: "#d73347",
                    fill: false,
                    label: "Number of Jobs",
                    pointBackgroundColor: "#d73347"
                }
            ],
            labels: ["2018", "2025", "2035", "2045"]
        };

        myChart = new Chart(canvas,{
            type: "line",
            data: data,
            options: {
                tooltips: {
                    mode: "index",
                    intersect: false
                },
                hover: {
                    mode: "nearest",
                    intersect: true
                },
                scales:{
                    xAxes: [{
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: "Year"
                        }
                    }],
                    yAxes: [{
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: "Number of Jobs"
                        },
                        ticks: {
                            callback: function(value){
                                return parseFloat(value).toLocaleString();
                            }
                        }
                    }]
                }
            }
        });

        return canvas;
    }

    //Functions to determine the screen size
    function updateView(isMobile){
        setMobileWidgets(isMobile);
    }

    function setMobileWidgets(isMobile){
        if (isMobile){
            view.ui.add(expandLegend, "top-left");
            view.ui.add(basemapToggle, "top-right");
            view.ui.add(home, "top-left");
            view.ui.remove(zoom);
            view.ui.remove(searchWidget);
            view.ui.remove(legendWidget);
        } else {
            view.ui.add(legendWidget, "top-right");
            view.ui.add(basemapToggle, "bottom-right");
            view.ui.add(zoom, "bottom-right");
            view.ui.add(home, "bottom-right");
            view.ui.add(searchWidget, "bottom-right");
            view.ui.remove(expandLegend);
        }
    }
    
});