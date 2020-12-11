import {useState, useCallback} from 'react';

export const useHttp = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const request = useCallback(async (url, method = 'GET', body = null, headers = {}) => {
        setLoading(true);
        try {
            if (body) {
             body = JSON.stringify(body) ;
             headers['Content-Type'] = 'application/json'
            }
console.log(body)
           const responce = await fetch(url, {method, body, headers});
           console.log(responce)
           const data = await responce.json();

            if (!responce.ok) {
                throw new Error(data.message ||'Something wrong');
            }

            setLoading(false);

            return data;
        } catch(e) {
            setLoading(false);
            setError(e.message);
            throw e;
        }
    }, [])

    const clearError = () => setError(null);

    return {loading, request, error, clearError};
}