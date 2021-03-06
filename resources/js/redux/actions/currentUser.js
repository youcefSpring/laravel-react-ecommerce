import { APP_URL } from "../../constants";
import { currentUserActions } from "../reducers/types";
import { 
    removeAuthToken,
    getAuthToken,
} from "../../utilities/methods";

export default { getCurrentUser };

function getCurrentUser() {    
    return async dispatch => {
        dispatch(request(currentUserActions.GET_CURRENT_USER_PENDING));

        const url = encodeURI(APP_URL + "/user/authenticate");
        const token = getAuthToken();
        
        if (null === token) {
            return dispatch(
                error(
                    currentUserActions.GET_CURRENT_USER_ERROR,
                    "No token stored"
                )
            );
        }
        
        await fetch(url, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => res.json())
            .then(json => {
                if (!json.data) {
                    dispatch(
                        error(
                            currentUserActions.GET_CURRENT_USER_ERROR,
                            json.error
                        )
                    );
                } else {
                    dispatch(
                        success(
                            currentUserActions.GET_CURRENT_USER_SUCCESS,
                            json.data
                        )
                    );
                }
            })
            .catch(err => {
                dispatch(
                    error(currentUserActions.GET_CURRENT_USER_ERROR, err)
                );
                if (getAuthToken()) {
                    removeAuthToken();
                }
            });

        function request(type) {
            return {
                type
            };
        }

        function error(type, payload) {
            return {
                type,
                payload
            };
        }

        function success(type, payload) {
            return {
                type,
                payload
            };
        }
    };
}
