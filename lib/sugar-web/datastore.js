define(["./env", "./datastore/sugarizer", "./datastore/sugaros"], function(env, sugarizer, sugaros) {

    'use strict';

    var datastore ;

    if (env.isSugarizer()) {
        datastore = sugarizer;
    } else {
        datastore = sugaros;
    }

    return datastore;
});
