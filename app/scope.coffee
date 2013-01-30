class Scope
  constructor: (options) ->

    # @featureDetect()

    @scaleFactor = 20000

    @debug = false


    @objects = []
    @camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 )
    @camera.position.set( 200, 200, 200 )

    @scene = new THREE.Scene()

    @renderer = new THREE.CSS3DRenderer()
    @renderer.setSize( window.innerWidth, window.innerHeight );
    @renderer.domElement.style.position = 'absolute';
    @renderer.domElement.style.top = 0;
    document.body.appendChild(@renderer.domElement );

    @setupAnimationFrame()
    @startPositionDetection()
    requestAnimationFrame(@step)

  step: () =>
    window.requestAnimationFrame(@step)
    return if !@items? || !@longitude? || !@latitude? || !@heading?


    # @camera.lookAt(@items[0].longitude * @scaleFactor, 0, @items[0].latitude * @scaleFactor)
    @camera.rotation.y = @heading.toRad()

    @everySecond ?= -1
    if ((@everySecond += 1) % 120) == 0
      @camera.position.set(@longitude * @scaleFactor, 0, @latitude * @scaleFactor, 0)

    #   for item in @items
    #     item.distance = @haversineDistance(@latitude, @longitude, item.latitude, item.longitude)
    #     item.heading = @bearing(@latitude, @longitude, item.latitude, item.longitude)

    if @debug
      @heading += 2
      @heading %= 360

    @renderer.render(@scene, @camera);
    console.info("yeah")

  getCulture: (lat, lon) ->
    url = "http://kn-reise.delving.org/organizations/kn-reise/api/search?query=delving_spec:kulturit&qf=europeana_dataProvider_facet:Oslo%20Museum&qf=dc_type_facet:StillImage&format=json&rows=50&"
    pointArgument = "pt=" + lat + "," + lon
    url += pointArgument

    $.getJSON url, (data) =>
      items = data.result.items
      console.info(items)
      @items = _.map(items, (entry) ->
        fields = entry.item.fields
        {
          longitude: parseFloat(fields.abm_long[0])
          latitude: parseFloat(fields.abm_lat[0])
          thumbnail: fields.delving_thumbnail[0]
        }
      )
      console.info(@items)

      for item in @items
        console.info("Adding object")

        element = document.createElement('div')
        element.style.width = '20px'
        element.style.height = '20px'
        element.style.background = new THREE.Color(Math.random() * 0xffffff).getStyle()

        image = document.createElement('img')
        image.style.position = 'absolute'
        # image.style.height = '360px'
        image.src = item.thumbnail
        console.info(item.thumbnail)
        element.appendChild(image)

        object = new THREE.CSS3DObject(element);
        object.position.set(item.longitude * @scaleFactor, (Math.random() * 500) - 250, item.latitude * @scaleFactor, 0);
        @objects.push(object)
        @scene.add(object);

  positionChanged: (position) =>
    @latitude = position.coords.latitude
    @longitude = position.coords.longitude
    $("#pos").html(position.coords.latitude + "," + position.coords.longitude)
    @getCulture(@latitude, @longitude)


  headingChanged: (e) =>
    if e.webkitCompassHeading?
      @heading = -parseFloat(e.webkitCompassHeading)
    else
      # We expect that an undefined heading means it is unsupported
      @heading = 0
      @debug = true

    console.info @heading
    headingDebug = 'heading: ' + @heading +
               '\n' + 
               'headingAccuracy: ' + e.webkitCompassAccuracy
    $("#heading").html(headingDebug)

  startPositionDetection: () ->
    navigator.geolocation.getCurrentPosition(@positionChanged)
    @watchID = navigator.geolocation.watchPosition(@positionChanged)
    window.addEventListener('deviceorientation', @headingChanged, false)

  featureDetect: () ->
    alert("implementme")
    # if (navigator.geolocation) {
    #   navigator.geolocation.getCurrentPosition(success, error);
    # } else {
    #   error('not supported');
    # }

  haversineDistance: (lat1, lon1, lat2, lon2) ->
    R = 6371
    dLat = (lat2-lat1).toRad()
    dLon = (lon2-lon1).toRad()
    lat1 = lat1.toRad()
    lat2 = lat2.toRad()

    a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2) 
    c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)) 
    d = R * c

  bearing: (lat1, lon1, lat2, lon2) ->
    dLat = (lat2-lat1).toRad()
    dLon = (lon2-lon1).toRad()
    y = Math.sin(dLon) * Math.cos(lat2)
    x = Math.cos(lat1)*Math.sin(lat2) -
      Math.sin(lat1)*Math.cos(lat2)*Math.cos(dLon)
    brng = Math.atan2(y, x).toDeg()
  
  # refactor into module

  setupAnimationFrame:() ->
    requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame
    window.requestAnimationFrame = requestAnimationFrame

if (typeof Number.prototype.toRad == 'undefined')
  Number.prototype.toRad = ->
    return this * Math.PI / 180

if (typeof Number.prototype.toDeg == 'undefined')
  Number.prototype.toDeg = ->
    return this * 180 / Math.PI

window.requestAnimFrame = () ->
  window.requestAnimationFrame       || 
  window.webkitRequestAnimationFrame || 
  window.mozRequestAnimationFrame    || 
  window.oRequestAnimationFrame      || 
  window.msRequestAnimationFrame     || 
  () ->
    window.setTimeout(callback, 1000 / 60)

module.exports = Scope

