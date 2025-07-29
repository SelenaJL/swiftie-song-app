// frontend/src/utils/apiUtils.js

export const getMetadata = () => {
    return {
        headers: {
            Authorization: localStorage.getItem('token')
        }
    };
}   