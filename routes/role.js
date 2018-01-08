import Role from './role';
// import { sendResult, sendError } from '../global-functions/request-response-functions';
// import { checkUserPermissions } from '../global-functions/user-functions';


const createRole = (request, response) => {
	try {
    if (request['userObject']) {
      var newRoleObject = request['body'];
      var requstedUser = request['userObject'];
      newRoleObject['permissions'] = JSON.parse(newRoleObject.permissions);
      newRoleObject['createdBy'] = newRoleObject['updatedBy'] = requstedUser['_id'];

      checkUserPermissions(requstedUser, "roles", "create")
      .then( isPermitted => {
        if (isPermitted) {
          Role.create(newRoleObject, (error, role) => {
          	if (error) sendError(error['errmsg'] || error['message'], response);
          	else if (role) sendResult(role, response);
          	else sendError("Role Not Created", response);
          });
        } else sendError("User Not Authorized", response);
      })
      .catch( error => {
        sendError(error, response);
      });
    } else sendError("Un Authorized Request", response);
	} catch (e) {
		console.log("Error in createRole Method ", e);
		sendError(e, response);
	}
};

const updateRole = (request, response) => {
	try {
    if (request['userObject']) {
      var roleObject = request['body'];
      var requstedUser = request['userObject'];

      roleObject['permissions'] = JSON.parse(roleObject.permissions);
      roleObject['updatedBy'] = requstedUser['_id'];

      checkUserPermissions(requstedUser, "roles", "update")
      .then( isPermitted => {
        if (isPermitted) {
        	var query = { '_id': request['params']['_id'] },
        		options = roleObject;
      		if (options['_id'] || options['isActive']) {
      			sendError("Fields are not valid", response);
      			return;
      		};

          Role.update(query, {$set: options}, (error, role) => {
          	console.log(error || role);
          	if (error) sendError(error['errmsg'] || error['message'], response);
          	else if (role.nModified) sendResult(role, response);
          	else sendError("Role Not Updated", response);
          });
        } else sendError("User Not Authorized", response);
      })
      .catch( error => {
        sendError(error, response);
      });
    } else sendError("Un Authorized Request", response);
	} catch (e) {
		console.log("Error in updateRole Method ", e);
		sendError(e, response);
	}
};

const getRole = (request, response) => {
	try {
    if (request['userObject']) {
      var requstedUser = request['userObject'];

      checkUserPermissions(requstedUser, "roles", "read")
      .then( isPermitted => {
        if (isPermitted) {
        	var query = { '_id': request['params']['_id'] };

          Role.findOne(query, (error, role) => {
          	if (error) sendError(error['errmsg'] || error['message'], response);
          	else if (role === null) sendError("No Role Found", response);
          	else sendResult(role, response);
          });
        } else sendError("User Not Authorized", response);
      })
      .catch( error => {
        sendError(error, response);
      });
    } else sendError("Un Authorized Request", response);
	} catch (e) {
		console.log("Error in updateRole Method ", e);
		sendError(e, response);
	}
};

const getRoles = (request, response) => {
	try {
		if (request['userObject']) {
			var requstedUser = request['userObject'];

			checkUserPermissions(requstedUser, "roles", "list")
			.then( isPermitted => {
				if (isPermitted) {
					var queryParameters = request['query'];
					// if sort parameters is not present, default values will be assigned
					var sort = {};

					if (queryParameters['sortParameter'] && queryParameters['order']) {
						if (queryParameters['order'] == 'asc')
							sort[queryParameters['sortParameter']] = 1;
						else sort[queryParameters['sortParameter']] = -1;
					}
					else sort['createdAt'] = -1;
					 // if limit parameter is not present, default values will be assigned
					var limit = queryParameters['limit'] || 10;
					var pageNumber = queryParameters['page'] || 1;

					console.log("sort ", sort)
					Role.find().sort(sort).skip((pageNumber-1)*limit).limit(limit)
					.select({})
					.exec( (error, roles) => {
						if (error) sendError(error['errmsg'] || error['message'], response)
						else sendResult(roles, response);
					});
				} else sendError("User Not Perimitted", response);
			})
			.catch ( error =>  {
				sendError(error, response);
			})
		} else {
			sendError("Un Authorized Request", response);
		}
	} catch (e) {
		console.log("\nRuntime Error- getUsers Method user-controller.js", e);
		sendError("Internal Server Error", response);
	}
};

const deleteRole = (request, response) => {
	try {
    if (request['userObject']) {
      var requstedUser = request['userObject'];

      checkUserPermissions(requstedUser, "roles", "delete")
      .then( isPermitted => {
        if (isPermitted) {
        	var query = { '_id': request['params']['_id'] };
        	var options = { isActive: false };

          Role.remove(query, (error, result) => {
          	console.log(error || result)
          	if (error) sendError(error['errmsg'] || error['message'], response);
          	else if (result) sendResult(result, response);
          	else sendError("Role Not Removed", response);
          });

        } else sendError("User Not Authorized", response);
      })
      .catch( error => {
        sendError(error, response);
      });
    } else sendError("Un Authorized Request", response);
	} catch (e) {
		console.log("Error in deleteRole Method ", e);
		sendError(e, response);
	}
};

const activateRole = (request, response) => {
	try {
    if (request['userObject']) {
      var requstedUser = request['userObject'];

      checkUserPermissions(requstedUser, "roles", "activityControl")
      .then( isPermitted => {
        if (isPermitted) {
        	var query = { '_id': request['params']['_id'] };
        	var options = { isActive: true };

          Role.update(query, {$set: options}, (error, role) => {
          	if (error) sendError(error['errmsg'] || error['message'], response);
          	else if (role.nModified) sendResult(role, response);
          	else sendError("Role Not Updated", response);
          });

        } else sendError("User Not Authorized", response);
      })
      .catch( error => {
        sendError(error, response);
      });
    } else sendError("Un Authorized Request", response);
	} catch (e) {
		console.log("Error in updateRole Method ", e);
		sendError(e, response);
	}
};

const inActivateRole = (request, response) => {
	try {
    if (request['userObject']) {
      var requstedUser = request['userObject'];

      checkUserPermissions(requstedUser, "roles", "activityControl")
      .then( isPermitted => {
        if (isPermitted) {
        	var query = { '_id': request['params']['_id'] };
        	var options = { isActive: false };

          Role.update(query, {$set: options}, (error, role) => {
          	if (error) sendError(error['errmsg'] || error['message'], response);
          	else if (role.nModified) sendResult(role, response);
          	else sendError("Role Not Updated", response);
          });

        } else sendError("User Not Authorized", response);
      })
      .catch( error => {
        sendError(error, response);
      });
    } else sendError("Un Authorized Request", response);
	} catch (e) {
		console.log("Error in activateRole Method ", e);
		sendError(e, response);
	}
};

export { createRole, updateRole, getRole, getRoles, deleteRole, activateRole, inActivateRole };
