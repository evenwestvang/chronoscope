# App Namespace
# Change `Hipster` to your app's name
@Hipster ?= {}
Hipster.Routers ?= {}
Hipster.Views ?= {}
Hipster.Models ?= {}
Hipster.Collections ?= {}

$ ->
    # Load App Helpers
    require '../lib/app_helpers'
    Scope = require './scope'

    # Initialize App
    Hipster.Views.AppView = new AppView = require 'views/app_view'

    # Initialize Backbone History
    Backbone.history.start pushState: yes

    scope = new Scope()
    window.scope = scope

