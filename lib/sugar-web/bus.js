define(["./env", "./bus/sugarizer", "./bus/sugaros"], function(env, sugarizer, sugaros) {

    'use strict';

    var bus;

    if (env.isSugarizer()) {
        bus = sugarizer;
    } else {
        bus = sugaros;
    }

    return bus;
});
