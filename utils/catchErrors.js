export default function catchErrors(error) {

    let errorMsg;

    if (error.response) {
        //status code is not 2XX
        if (error.response.data.message) {
            //image upload error
           errorMsg =  error.response.data.message
        }
        else {
            errorMsg = error.response.data
        }
        
    }
    else if (error.request) {
        errorMsg = error.request
    }
    else {
        errorMsg =  error.message
    }

    return errorMsg;

}