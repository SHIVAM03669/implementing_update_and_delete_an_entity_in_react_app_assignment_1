import { useState } from "react";

const API_URI = `http://${import.meta.env.VITE_API_URI}/doors`;

const DeleteItem = () => {
    const [itemId, setItemId] = useState("");
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setResponse(null);

        try {
            const response = await fetch(`${API_URI}/${itemId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete item');
            }

            setResponse('Door deleted successfully!');
            setItemId("");
            setIsLoading(false);
        } catch (error) {
            setError(error.message);
            setIsLoading(false);
        }
    };

    return (
        <div className="delete-item-container">
            <h2>Delete Door</h2>
            
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="itemId">Door ID:</label>
                    <input
                        type="number"
                        id="itemId"
                        value={itemId}
                        onChange={(e) => setItemId(e.target.value)}
                        required
                        min="1"
                    />
                </div>
                
                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Deleting...' : 'Delete Door'}
                </button>
            </form>
            
            {error && <div className="error-message">{error}</div>}
            {response && <div className="success-message">{response}</div>}
        </div>
    );
};

export default DeleteItem; 