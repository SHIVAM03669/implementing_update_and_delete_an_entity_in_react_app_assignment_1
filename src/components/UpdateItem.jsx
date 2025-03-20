import { useState, useEffect } from "react";

// Fix the API URI construction
const API_URI = import.meta.env.VITE_API_URI;

const UpdateItem = () => {
    const [item, setItem] = useState(null);
    const [updatedItem, setUpdatedItem] = useState({});
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [itemId, setItemId] = useState("1");
    
    // Fetch the existing item when the component mounts or itemId changes
    useEffect(() => {
        const fetchItem = async () => {
            if (!itemId) return;
            
            setIsLoading(true);
            setError(null);
            setResponse(null);
            
            try {
                const response = await fetch(`${API_URI}/doors/${itemId}`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch item: ${response.statusText}`);
                }
                const data = await response.json();
                setItem(data);
                setUpdatedItem(data);
                setIsLoading(false);
            } catch (error) {
                console.error('Fetch error:', error);
                setError(error.message);
                setIsLoading(false);
            }
        };
        
        fetchItem();
    }, [itemId]);
    
    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdatedItem(prev => ({
            ...prev,
            [name]: value
        }));
    };
    
    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setResponse(null);
        
        try {
            const response = await fetch(`${API_URI}/doors/${itemId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedItem)
            });
            
            if (!response.ok) {
                throw new Error(`Failed to update item: ${response.statusText}`);
            }
            
            const data = await response.json();
            setItem(data);
            setResponse('Door updated successfully!');
            setIsLoading(false);
        } catch (error) {
            console.error('Update error:', error);
            setError(error.message);
            setIsLoading(false);
        }
    };
    
    if (isLoading) return <div className="loading">Loading...</div>;
    
    return (
        <div className="update-item-container">
            <h2>Update Door</h2>
            
            <div className="form-group">
                <label htmlFor="itemId">Door ID:</label>
                <input
                    type="number"
                    id="itemId"
                    value={itemId}
                    onChange={(e) => setItemId(e.target.value)}
                    min="1"
                    required
                />
            </div>
            
            {error && <div className="error-message">{error}</div>}
            
            {item && (
                <>
                    <div className="current-item">
                        <h3>Current Door Details</h3>
                        <p>ID: {item.id}</p>
                        <p>Name: {item.name}</p>
                        <p>Description: {item.description}</p>
                        <p>Status: {item.status}</p>
                    </div>
                    
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="name">Name:</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={updatedItem.name || ''}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="description">Description:</label>
                            <textarea
                                id="description"
                                name="description"
                                value={updatedItem.description || ''}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="status">Status:</label>
                            <select
                                id="status"
                                name="status"
                                value={updatedItem.status || 'closed'}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="open">Open</option>
                                <option value="closed">Closed</option>
                            </select>
                        </div>
                        
                        <button type="submit" disabled={isLoading}>
                            {isLoading ? 'Updating...' : 'Update Door'}
                        </button>
                    </form>
                </>
            )}
            
            {response && <div className="success-message">{response}</div>}
        </div>
    );
};

export default UpdateItem;

