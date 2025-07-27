// frontend/src/utils/apiUtils.js

const metadata = {
    headers: {
        Authorization: localStorage.getItem('token')
    }
};

export const getMetadata = () => {
    return metadata;
}   