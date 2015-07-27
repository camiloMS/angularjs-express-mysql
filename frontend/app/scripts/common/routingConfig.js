(function(exports){

    var config = {

        /* List all the roles you wish to use in the app
        * You have a max of 31 before the bit shift pushes the accompanying integer out of
        * the memory footprint for an integer
        */
        roles :[
            'public',
            'user',
            'editor',
            'manager',
            'admin',
            'root'
        ],

        /*
        Build out all the access levels you want referencing the roles listed above
        You can use the "*" symbol to represent access to all roles.

        The left-hand side specifies the name of the access level, and the right-hand side
        specifies what user roles have access to that access level. E.g. users with user role
        'user' and 'admin' have access to the access level 'user'.
         */
        accessLevels : {
            'public' : "*",
            'anon': ['public'],
            'user' : ['user', 'editor', 'manager', 'admin', 'root'],
            'editor': ['editor', 'manager', 'admin', 'root'],
            'manager': ['manager', 'admin', 'root'],
            'admin': ['admin', 'root'],
            'root': ['root']
        }

    }

    /*
      userRoles = {'public': 1, 'user': 2, 'admin': 4}
        {'public':{'title': 'public', 'bit_mask':1}, 'user':{'title': 'user', 'bit_mask':2},'admin':{'title': 'admin', 'bit_mask':4}},
      accessLevels = {'public': 7, 'anon': 1, 'user': 6, 'admin': 4}
     */
    exports.userRoles = buildRoles(config.roles);
    exports.accessLevels = buildAccessLevels(config.accessLevels, exports.userRoles);

    /*
        Method to build a distinct bit mask for each role
        It starts off with "1" and shifts the bit to the left for each element in the
        roles array parameter
     */

    function buildRoles(roles){

        var bit_mask = "01";
        var userRoles = {};

        for(var role in roles){
            var intCode = parseInt(bit_mask, 2);
            userRoles[roles[role]] = {
                bit_mask: intCode,
                title: roles[role]
            };
            bit_mask = (intCode << 1 ).toString(2)
        }

        return userRoles;
    }

    /*
    This method builds access level bit masks based on the accessLevelDeclaration parameter which must
    contain an array for each access level containing the allowed user roles.
     */
    function buildAccessLevels(accessLevelDeclarations, userRoles){

        var accessLevels = {};
        for(var level in accessLevelDeclarations){

            if(typeof accessLevelDeclarations[level] == 'string'){
                if(accessLevelDeclarations[level] == '*'){

                    var resultBitMask = '';

                    for( var role in userRoles){
                        resultBitMask += "1"
                    }
                    //accessLevels[level] = parseInt(resultBitMask, 2);
                    accessLevels[level] = {
                        bit_mask: parseInt(resultBitMask, 2)
                    };
                }
                else console.log("Access Control Error: Could not parse '" + accessLevelDeclarations[level] + "' as access definition for level '" + level + "'")

            }
            else {

                var resultBitMask = 0;
                for(var role in accessLevelDeclarations[level]){
                    if(userRoles.hasOwnProperty(accessLevelDeclarations[level][role]))
                        resultBitMask = resultBitMask | userRoles[accessLevelDeclarations[level][role]].bit_mask
                    else console.log("Access Control Error: Could not find role '" + accessLevelDeclarations[level][role] + "' in registered roles while building access for '" + level + "'")
                }
                accessLevels[level] = {
                    bit_mask: resultBitMask
                };
            }
        }

        return accessLevels;
    }

})(typeof exports === 'undefined' ? this['routingConfig'] = {} : exports);
