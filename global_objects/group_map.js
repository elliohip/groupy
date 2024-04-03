
/**
 * contains keys in the format 
 * (solid-group-id, runtime-group-id)
 * 
 * this is for keeping track of groups that are deployed at 
 * runtime, compared to groups that are stored in the state works like: 
 * 
 * get(solid-group-id);
 */
var group_map = new Map();

module.exports = group_map;