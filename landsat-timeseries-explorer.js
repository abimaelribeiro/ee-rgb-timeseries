/**
 * @license
 * Copyright 2021 Justin Braaten
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

  // #############################################################################
  // ### INSTRUCTIONS ###
  // #############################################################################

  // 1) Add a polygon through the assets tab
  // 2) Click run
  // 3) Reset the parameters according to your project

  // #############################################################################
  // ### ADDITIONAL PARAMS ###
  // #############################################################################

  // Export CRS
  var crsExportImage = 'EPSG:31980';
  
  // Folder for storage                                        
  var processFolder = 'EarthEngine';
  
  //Display params
  
  // View zoom on the map
  var zoomLevelAoi = 14;
  
  // Centroid color on the map
  var centroidColorParam = 'red';

  // Polygon color on the map
  var visParamAreaMap = {color: 'yellow', fillColor: '00000000', width: 3};  
  

  // #############################################################################
  // ### CENTROID INFO ###
  // #############################################################################

  var centroid = table.geometry().centroid();
  var centroideInfo = ee.List(centroid.coordinates()).getInfo(0);
  //console.log('Coordenada da área >>> Longitude: ' + infoCentroide[0] + ', Latitude: ' + infoCentroide[1]);

  // #############################################################################
  // ### IMPORT MODULES ###
  // #############################################################################

  // RGB time series charting module: https://github.com/jdbcode/ee-rgb-timeseries
  var rgbTs = require('users/jstnbraaten/modules:rgb-timeseries/rgb-timeseries.js'); 
  
  // Landsat collection builder module: https://jdbcode.github.io/EE-LCB/
  var lcb = require('users/jstnbraaten/modules:ee-lcb.js');  
  
  // #############################################################################
  // ### GET URL PARAMS ###
  // #############################################################################
  
  
  var initRun = 'true';
  var runUrl = ui.url.get('run', initRun);
  ui.url.set('run', runUrl);
  
  var initLon = centroideInfo[0];
  var lonUrl = ui.url.get('lon', initLon);
  ui.url.set('lon', lonUrl);
  
  var initLat = centroideInfo[1];
  var latUrl = ui.url.get('lat', initLat);
  ui.url.set('lat', latUrl);
  
  var initYearFrom = 2018;
  var fromYearUrl = ui.url.get('fromYear', initYearFrom);
  ui.url.set('fromYear', fromYearUrl);
  
  var initYearTo = 2021;
  var toYearUrl = ui.url.get('toYear', initYearTo);
  ui.url.set('toYear', toYearUrl);
  
  var initFrom = '05-01';
  var fromUrl = ui.url.get('from', initFrom);
  ui.url.set('from', fromUrl);
  
  var initTo = '10-31';
  var toUrl = ui.url.get('to', initTo);
  ui.url.set('to', toUrl);
  
  var initIndex = 'NDVI';
  var indexUrl = ui.url.get('index', initIndex);
  ui.url.set('index', indexUrl);
  
  var initRgb = 'Cor natural simulada: SWIR1/NIR/GREEN (b6,b5,b3)';
  var rgbUrl = ui.url.get('rgb', initRgb);
  ui.url.set('rgb', rgbUrl);
  
  var initPolygonRgb = 'YELLOW';
  var rgbPolygonUrl = ui.url.get('rgbPolygon', initPolygonRgb);
  ui.url.set('rgbPolygon', rgbPolygonUrl);
  
  var initThumbnailDimension = 200;
  var thumbnailDimensionUrl = ui.url.get('thumbnailDimension', initThumbnailDimension);
  ui.url.set('thumbnailDimension', thumbnailDimensionUrl);
  
  var initChipWidth = 2;
  var chipWidthUrl = ui.url.get('chipwidth', initChipWidth);
  ui.url.set('chipwidth', chipWidthUrl);
  
  // #############################################################################
  // ### DEFINE UI ELEMENTS ###
  // #############################################################################
  
  // Style
  var CONTROL_PANEL_WIDTH = '500px';
  var CONTROL_PANEL_WIDTH_HIDE = '160px';
  var textFont = {fontSize: '12px'};
  var headerFont = {
    fontSize: '13px', fontWeight: 'bold', margin: '4px 8px 0px 8px'};
  var sectionFont = {
    fontSize: '16px', color: '808080', margin: '16px 8px 0px 8px'};
  var infoFont = {fontSize: '12px', color: '505050'};
  
  // Control panel.
  var controlPanel = ui.Panel({
    style: {position: 'top-left', width: CONTROL_PANEL_WIDTH_HIDE,
      maxHeight: '90%'
    }});
  
  // Info panel.
  var infoElements = ui.Panel(
    {style: {shown: false, margin: '0px -8px 0px -8px'}});
  
  // Element panel.
  var controlElements = ui.Panel(
    {style: {shown: false, margin: '0px -8px 0px -8px'}});
  
  // Instruction panel.
  var instr = ui.Label('Click em uma localização',
    {fontSize: '12px', color: '303030', margin: '0px 0px 6px 0px'});
  
  // Show/hide info panel button.
  var infoButton = ui.Button(
    {label: 'Sobre ❯', style: {margin: '0px 4px 0px 4px'}});
  
  // Show/hide control panel button.
  var controlButton = ui.Button(
    {label: 'Opções ❯', style: {margin: '0px 0px 0px 10px'}});
  
  // Info/control button panel.
  var buttonPanel = ui.Panel(
    [infoButton, controlButton],
    ui.Panel.Layout.Flow('horizontal'),
    {stretch: 'horizontal', margin: '0px 0px 0px 0px'});
  
  // Options label.
  var optionsLabel = ui.Label('Opções', sectionFont);
  optionsLabel.style().set('margin', '16px 8px 2px 8px');
  
  // Information label.
  var infoLabel = ui.Label('Sobre o App', sectionFont);
  
  // Information text. 
  var aboutLabel = ui.Label(
    'Este aplicativo foi editado por Abimael Ribeiro do trabalho original de Justin Braaten.',
    infoFont);
  
  var aboutLabel1 = ui.Label(
    'No original o aplicativo permitia a visualização de uma série de imagens do satélite Landsat ' + 
    'e um gráfico dos índices de vegetação [NBR, NDVI, TBC entre outros].',
    infoFont);
    
  var aboutLabel2 = ui.Label(
    'Agora, com as novas funcionalidades, é possível editar outros parâmetros diretamente na interface do app, visualizar o polígono na imagem, ' +
    'além de ser possível exportá-las em formato tiff para trabalhar em um SIG de sua preferência. Veja as imagens na aba Tasks.',
    infoFont);
  
  var aboutLabel3 = ui.Label(
    'As imagens são geradas por meio de uma média anual em uma janela de tempo definida pelo usuário, e ' + 
    'as cores do gráfico de índice de vegetação são definidas com base na média ponderada da intensidade do pixel. ' +
    'A média ponderada é obtida levando-se em consideração um conjunto de pixels em um raio de 45 metros do local escolhido pelo usuário.',
    infoFont);
  
  var aboutLabel4 = ui.Label(
    'Para visualizar um novo índice de vegetação basta clicar na área de interesse e o aplicativo ' + 
    'apresentará um novo gráfico de índice de vegetação para o local escolhido. ' +
    'Por padrão, o primeiro gráfico apresentado pelo aplicativo é referente ao do centroide do polígono da área de estudo.',
    infoFont);
    
  var appDerivedCodeLink = ui.Label({
    value: 'Código-fonte atualizado',
    style: {fontSize: '11px', color: '505050', margin: '-4px 8px 10px 8px'}, 
    targetUrl: 'https://github.com/abimaelribeiro'
  });
  
  var appCodeLink = ui.Label({
    value: 'Código-fonte original do aplicativo',
    style: {fontSize: '11px', color: '505050', margin: '-4px 8px 0px 8px'}, 
    targetUrl: 'https://github.com/jdbcode/ee-rgb-timeseries/blob/main/landsat-timeseries-explorer.js'
  });
  
  // Date panel.
  var YearSectionLabel = ui.Label('Ano', headerFont);
  
  var startYearLabel = ui.Label('De:', textFont);
  var startYearBox = ui.Textbox({value: parseInt(ui.url.get('fromYear')), style: textFont});
  startYearBox.style().set('stretch', 'horizontal');
          
  var endYearLabel = ui.Label('Para:', textFont);
  var endYearBox = ui.Textbox({value: parseInt(ui.url.get('toYear')), style: textFont});
  endYearBox.style().set('stretch', 'horizontal');
          
  var yearPanel = ui.Panel([
      YearSectionLabel,
      ui.Panel([startYearLabel, startYearBox, endYearLabel, endYearBox],
      ui.Panel.Layout.Flow('horizontal'), {stretch: 'horizontal'})
  ], null, {margin: '0px'});
  
  
  var dateSectionLabel = ui.Label(
    'Período do ano (mês-dia)', headerFont);
  var startDayLabel = ui.Label('De:', textFont);
  var startDayBox = ui.Textbox({value: ui.url.get('from'), style: textFont});
  startDayBox.style().set('stretch', 'horizontal');
  
  var endDayLabel = ui.Label('Para:', textFont);
  var endDayBox = ui.Textbox({value: ui.url.get('to'), style: textFont});
  endDayBox.style().set('stretch', 'horizontal');
  
  var datePanel = ui.Panel([
      dateSectionLabel,
      ui.Panel([startDayLabel, startDayBox, endDayLabel, endDayBox],
        ui.Panel.Layout.Flow('horizontal'), {stretch: 'horizontal'})
    ], null, {margin: '0px'});
  
  // Y-axis index selection.
  var indexLabel = ui.Label('Ecolha o índice de vegetação - Landsat 8', headerFont);
  var indexList = ['NBR', 'NDVI', 'TCB', 'TCG', 'TCW',
                   'B2', 'B3', 'B4', 'B5', 'B6', 'B7'];
  var indexSelect = ui.Select(
    {items: indexList, value: ui.url.get('index'), style: {stretch: 'horizontal'}});
  var indexPanel = ui.Panel(
    [indexLabel, indexSelect], null, {stretch: 'horizontal'});
  
  // RGB bands selection.
  var rgbLabel = ui.Label({value: 'Escolha a composição colorida', style: headerFont});
  var rgbList = [
    'Cor natural simulada: SWIR1/NIR/GREEN (b6,b5,b3)',
    'Cor natural simulada: RED/GREEN/BLUE (b4,b3,b2)',
    'Infravermelho: NIR/RED/GREEN (b5,b4,b3)',
    'Falsa cor: TCB/TCG/TCW',
    'Falsa cor: NIR/SWIR1/RED'
  ];
  var rgbSelect = ui.Select({
    items: rgbList, placeholder: ui.url.get('rgb'),
    value: ui.url.get('rgb'), style: {stretch: 'horizontal'}
  });
  var rgbPanel = ui.Panel([rgbLabel, rgbSelect], null, {stretch: 'horizontal'});
  
  // Region buffer.
  var regionWidthLabel = ui.Label(
    {value: 'Área de visualização da imagem (1 - 200km)', style: headerFont});
  var regionWidthSlider = ui.Slider({
    min: 1, max: 200 , value: parseInt(ui.url.get('chipwidth')),
    step: 1, style: {stretch: 'horizontal'}
  });
  var regionWidthPanel = ui.Panel(
    [regionWidthLabel, regionWidthSlider], null, {stretch: 'horizontal'});
  

    // RGB polygon.
  var rgbPolygonLabel = ui.Label({value: 'Escolha a cor do polígono para plotagem', style: headerFont});
  var rgbPolygonList = [
    'YELLOW',
    'GREEN',
    'BLUE',
    'RED',
    'BLACK',
    'PURPLE',
    'WHITE'
  ];
  
  var rgbPolygonSelect = ui.Select({
    items: rgbPolygonList, value: ui.url.get('rgbPolygon'), style: {stretch: 'horizontal'}
  });
  var rgbPolygonPanel = ui.Panel(
    [rgbPolygonLabel, rgbPolygonSelect], null, {stretch: 'horizontal'});

  
  // A message to wait for image chips to load.
  var waitMsgImgPanel = ui.Label({
    value: '⚙️' + ' Processando. Por favor, espere um instante...',
    style: {
      stretch: 'horizontal',
      textAlign: 'center',
      backgroundColor: 'd3d3d3'
    }
  });
  
  // Panel to hold the chart.
  var chartPanel = ui.Panel({style: {height: '40%'}});
  
  
  
 //thumbnail dimension
  var thumbnailSectionLabel = ui.Label('Tamanho da miniatura em pixel', headerFont);
  
  var thumbnailDimensionLabel = ui.Label('Pixel:', textFont);
  var thumbnailDimensionBox = ui.Textbox({value: parseInt(ui.url.get('thumbnailDimension')), style: textFont});
  thumbnailDimensionBox.style().set('stretch', 'horizontal');
  
  var thumbnailDimensionPanel = ui.Panel([
      thumbnailSectionLabel,
      ui.Panel([thumbnailDimensionLabel, thumbnailDimensionBox],
      ui.Panel.Layout.Flow('horizontal'), {stretch: 'horizontal'})
  ], null, {margin: '0px'});
  
  // Holder for image cards.
  var imgCardPanel = ui.Panel({
    layout: ui.Panel.Layout.flow('horizontal', true),
    style: {width: '897px', backgroundColor: 'd3d3d3'}
  });
  
  // Map widget.
  var map = ui.Map();
  
  // Map/chart panel
  var mapChartSplitPanel = ui.Panel(ui.SplitPanel({
    firstPanel: map,
    secondPanel: chartPanel,
    orientation: 'vertical',
    wipe: false,
  }));
  
  // Map/chart and image card panel
  var splitPanel = ui.SplitPanel(mapChartSplitPanel, imgCardPanel);
  
  // Submit changes button.
  var submitButton = ui.Button(
    {label: 'Submeter alterações', style: {stretch: 'horizontal', shown: false}});
  
  
  
  // #############################################################################
  // ### DEFINE INITIALIZING CONSTANTS ###
  // #############################################################################
  
  // Set color of the circle to show on map and images where clicked
  var CENTROID_COLOR = centroidColorParam;
  
  var RGB_POLYGON_PARAMS = {
    'YELLOW': { palette:'yellow' },
     'GREEN': { palette:'green'  },
      'BLUE': { palette:'blue'   },
       'RED': { palette:'red'    },
     'BLACK': { palette:'black'  },
    'PURPLE': { palette:'purple' },
     'WHITE': { palette:'white'  },
  }
  
  // Define vis params.
  var VIS_PARAMS = {
    bands: ['B6', 'B5', 'B3'],
      min: [0, 0, 0],
      max: [4000, 4000, 4000]
  };
  
  var RGB_PARAMS = {
    'Cor natural simulada: SWIR1/NIR/GREEN (b6,b5,b3)': {
      bands: ['B6', 'B5', 'B3'],
      min: [100, 151 , 50],
      max: [4500, 4951, 2500],
      gamma: [1, 1, 1]
    },
    'Cor natural simulada: RED/GREEN/BLUE (b4,b3,b2)': {
      bands: ['B4', 'B3', 'B2'],
      min: [0, 50, 50],
      max: [2500, 2500, 2500],
      gamma: [1.2, 1.2, 1.2]
    },
    'Infravermelho: NIR/RED/GREEN (b5,b4,b3)': {
      bands: ['B5', 'B4', 'B3'],
      min: [151, 0, 50],
      max: [4951, 2500, 2500],
      gamma: [1, 1, 1]
    },
    'Falsa cor: TCB/TCG/TCW': {
      bands: ['TCB', 'TCG', 'TCW'],
      min: [604, -49, -2245],
      max: [5592, 3147, 843],
      gamma: [1, 1, 1]
    },
    'Falsa cor: NIR/SWIR1/RED': {
      bands: ['B5', 'B6', 'B3'],
      min: [151, 100, 50],
      max: [4951, 4500, 2500],
      gamma: [1, 1, 1]
    }
  };
  
  var COORDS = null;
  var CLICKED = false;
  
  // Set region reduction and chart params.
  var OPTIONAL_PARAMS = {
    reducer: ee.Reducer.mean(),
    scale: 30,
    crs: 'EPSG:4674',
    chartParams: {
      pointSize: 14,
      legend: {position: 'none'},
      hAxis: {title: 'Data', titleTextStyle: {italic: false, bold: true}},
      vAxis: {title: indexSelect.getValue(),titleTextStyle: {italic: false, bold: true}
      },
      explorer: {}
    }
  };
  
  // Set initial ee-lcb params: the date range is for CONUS summer.
  var LCB_PROPS = {
    startYear: startYearBox.getValue(),
    endYear: endYearBox.getValue(),
    startDate: startDayBox.getValue(),
    endDate: endDayBox.getValue(),
    sensors: ['LT05', 'LE07', 'LC08'],
    cfmask: ['cloud', 'shadow'],
    printProps: false
  };
  lcb.setProps(LCB_PROPS);
   
  
  
  // #############################################################################
  // ### DEFINE FUNCTIONS ###
  // #############################################################################
  
  /**
   * ee-lcb annual Landsat collection plan.
   */
  function imgColPlan(year){
    var col = lcb.sr.gather(year)
      .map(lcb.sr.maskCFmask)
      .map(lcb.sr.addBandNBR)
      .map(lcb.sr.addBandNDVI)
      .map(lcb.sr.addBandTC);
    return lcb.sr.mosaicMedian(col);
  }
  
  /**
   * Clears image cards from the image card panel.
   */
  function clearImgs() {
    imgCardPanel.clear();
  }
  
  /**
   * Displays image cards to the card panel.
   */
  
  function displayBrowseImg(col, aoiBox, aoiCircle, aoiArea) {
    clearImgs();
    waitMsgImgPanel.style().set('shown', true);
    imgCardPanel.add(waitMsgImgPanel);
  
    var visParams = RGB_PARAMS[rgbSelect.getValue()];
    
    var AREA_COLOR = RGB_POLYGON_PARAMS[rgbPolygonSelect.getValue()].palette;
    
    var dates = col.aggregate_array('composite_year');
    
    dates.evaluate(function(dates) {
      waitMsgImgPanel.style().set('shown', false);
      dates.forEach(function(date) {
        var img = col.filter(ee.Filter.eq('composite_year', date)).first();
        
        var aoiImg = ee.Image().byte()
          .paint(ee.FeatureCollection(ee.Feature(aoiCircle)), 1, 2)
          .visualize({palette: CENTROID_COLOR});
        
        var aoiAreaDano = ee.Image()
          .paint(ee.FeatureCollection(aoiArea),20, 2)
          .visualize({palette: AREA_COLOR});
        
        //inputDimension = 
        //console.log(inputDimension)
        
        var thumbnail = ui.Thumbnail({
          image: img.visualize(visParams).blend(aoiImg).blend(aoiAreaDano),
          params: {
            region: aoiBox,
            dimensions: thumbnailDimensionBox.getValue(),
            crs: 'EPSG:31980',
            format: 'PNG'
          }
        });
        
        var imgCard = ui.Panel([
          ui.Label(date,
            {margin: '4px 4px -6px 8px', fontSize: '13px', fontWeight: 'bold'}),
          thumbnail
        ], null, {margin: '4px 0px 0px 4px' , width: 'px'});
        
        imgCardPanel.add(imgCard);
        
        //Exportar imagens
        var imgExpDrive = img.toFloat()
        
        var exportToDrive = Export.image.toDrive({
            image: imgExpDrive,
            description: imgExpDrive.id().getInfo(),
            scale: 30,
            region: aoiBox,
            maxPixels: 9e10,
            crs: crsExportImage,
            folder: processFolder
          });
        
      });
    });
  }
  
  /**
   * Generates chart and adds image cards to the image panel.
   */
  function renderGraphics(coords) {
    // Get the selected RGB combo vis params.
    var visParams = RGB_PARAMS[rgbSelect.getValue()];
    
    // Get the clicked point and buffer it.
    var point = ee.Geometry.Point(coords);
    var aoiCircle = point.buffer(45);
    var aoiBox = point.buffer(regionWidthSlider.getValue()*1000/2);
    var aoiArea = ee.FeatureCollection(table);
    
    // Clear previous point from the Map.
    map.layers().forEach(function(el) {
      map.layers().remove(el);
    });
    
    // Add new polygon to the Map.
    var visParamsArea = visParamAreaMap;
    map.addLayer(aoiArea.style(visParamsArea));

    // Add new point to the Map.
    map.addLayer(aoiCircle, {color: CENTROID_COLOR});
    map.centerObject(aoiCircle, zoomLevelAoi);
    
    // Build annual time series collection.
    LCB_PROPS['aoi'] = aoiBox;
    LCB_PROPS['startYear'] = parseInt(startYearBox.getValue());
    LCB_PROPS['endYear'] = parseInt(endYearBox.getValue());
    LCB_PROPS['startDate'] = startDayBox.getValue();
    LCB_PROPS['endDate'] = endDayBox.getValue();
    lcb.props = lcb.setProps(LCB_PROPS);
    
    
    // Define annual collection year range as ee.List.
    var years = ee.List.sequence(lcb.props.startYear, lcb.props.endYear);
    var col = ee.ImageCollection.fromImages(years.map(imgColPlan));
  
    // Display the image chip time series. 
    displayBrowseImg(col, aoiBox, aoiCircle, aoiArea);
    OPTIONAL_PARAMS['chartParams']['vAxis']['title'] = indexSelect.getValue();
    
    // Render the time series chart.
    rgbTs.rgbTimeSeriesChart(col, aoiCircle, indexSelect.getValue(), visParams,
      chartPanel, OPTIONAL_PARAMS);
  }
  
  /**
   * Handles map clicks.
   */
  function handleMapClick(coords) {
    CLICKED = true;
    COORDS = [coords.lon, coords.lat];
    ui.url.set('run', 'true');
    ui.url.set('lon', COORDS[0]);
    ui.url.set('lat', COORDS[1]);
    renderGraphics(COORDS);
  }
  
  /**
   * Handles submit button click.
   */
  function handleSubmitClick() {
    renderGraphics(COORDS);
    submitButton.style().set('shown', false);
  }

  /**
   * Sets URL params.
   */
  function setParams() {
    ui.url.set('fromYear', startYearBox.getValue());
    ui.url.set('toYear', endYearBox.getValue());
    ui.url.set('from', startDayBox.getValue());
    ui.url.set('to', endDayBox.getValue());
    ui.url.set('index', indexSelect.getValue());
    ui.url.set('rgb', rgbSelect.getValue());
    ui.url.set('rgbPolygon', rgbPolygonSelect.getValue());
    ui.url.set('chipwidth', regionWidthSlider.getValue());
  }   
    
  /**
   * Show/hide the submit button.
   */
  function showSubmitButton() {
    if(CLICKED) {
      submitButton.style().set('shown', true);
    }
  }
  
  /**
   * Handles options changes.
   */
  function optionChange() {
    showSubmitButton();
    setParams();
  }
  
  /**
   * Show/hide the control panel.
   */
  var controlShow = false;
  function controlButtonHandler() {
    if(controlShow) {
      controlShow = false;
      controlElements.style().set('shown', false);
      controlButton.setLabel('Opções ❯');
    } else {
      controlShow = true;
      controlElements.style().set('shown', true);
      controlButton.setLabel('Opções ❮');
    }
    
    if(infoShow | controlShow) {
      controlPanel.style().set('width', CONTROL_PANEL_WIDTH);
    } else {
      controlPanel.style().set('width', CONTROL_PANEL_WIDTH_HIDE);
    }
  }
  
  /**
   * Show/hide the control panel.
   */
  var infoShow = false;
  function infoButtonHandler() {
    if(infoShow) {
      infoShow = false;
      infoElements.style().set('shown', false);
      infoButton.setLabel('Sobre ❯');
    } else {
      infoShow = true;
      infoElements.style().set('shown', true);
      infoButton.setLabel('Sobre ❮');
    }
    
    if(infoShow | controlShow) {
      controlPanel.style().set('width', CONTROL_PANEL_WIDTH);
    } else {
      controlPanel.style().set('width', CONTROL_PANEL_WIDTH_HIDE);
    }
  }
  
  
  
  // #############################################################################
  // ### SETUP UI ELEMENTS ###
  // #############################################################################
  
  infoElements.add(infoLabel);
  infoElements.add(aboutLabel);
  infoElements.add(aboutLabel1);
  infoElements.add(aboutLabel2);
  infoElements.add(aboutLabel3);
  infoElements.add(aboutLabel4);
  infoElements.add(appDerivedCodeLink);
  infoElements.add(appCodeLink);
  
  controlElements.add(optionsLabel);
  controlElements.add(yearPanel);
  controlElements.add(datePanel);
  controlElements.add(indexPanel);
  controlElements.add(rgbPanel);
  controlElements.add(rgbPolygonPanel);
  controlElements.add(thumbnailDimensionPanel);
  controlElements.add(regionWidthPanel);
  controlElements.add(submitButton);
  
  controlPanel.add(instr);
  controlPanel.add(buttonPanel);
  controlPanel.add(infoElements);
  controlPanel.add(controlElements);
  
  map.add(controlPanel);
  
  infoButton.onClick(infoButtonHandler);
  controlButton.onClick(controlButtonHandler);
  startYearBox.onChange(optionChange);
  endYearBox.onChange(optionChange);
  startDayBox.onChange(optionChange);
  endDayBox.onChange(optionChange);
  rgbSelect.onChange(optionChange);
  rgbPolygonSelect.onChange(optionChange);
  indexSelect.onChange(optionChange);
  thumbnailDimensionBox.onChange(optionChange);
  regionWidthSlider.onChange(optionChange);
  submitButton.onClick(handleSubmitClick);
  map.onClick(handleMapClick);
  
  map.style().set('cursor', 'crosshair');
  map.setOptions('SATELLITE');
  map.setControlVisibility(
    {layerList: true, fullscreenControl: false, zoomControl: false});
  
  ui.root.clear();
  ui.root.add(splitPanel);
  
  if(ui.url.get('run')) {
    CLICKED = true;
    COORDS = [ui.url.get('lon'), ui.url.get('lat')];
    renderGraphics(COORDS);
  }