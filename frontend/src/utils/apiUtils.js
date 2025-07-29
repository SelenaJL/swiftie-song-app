// frontend/src/utils/apiUtils.js

export const getMetadata = () => {
    const token = localStorage.getItem('token');
    return {
        headers: {
            Authorization: token ? `Bearer ${token}` : ''
        }
    };
}   