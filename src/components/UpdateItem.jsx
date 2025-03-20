import { useState, useEffect } from "react";

const API_URI = `http://${import.meta.env.VITE_API_URI}/doors`;

const UpdateItem = () => {
    // Initialize state variables to store the existing item, updated item, and API response
    const [item, setItem] = useState(null);
    const [updatedItem, setUpdatedItem] = useState({});
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    
    // Fetch the existing item when the component mounts
    useEffect(() => {
        const fetchItem = async () => {
            try {
                // Fetch door with ID 1 as an example
                const response = await fetch(`${API_URI}/1`);
                if (!response.ok) {
                    throw new Error('Failed to fetch item');
                }
                const data = await response.json();
                setItem(data);
                setUpdatedItem(data);
                setIsLoading(false);
            } catch (error) {
                setError(error.message);
                setIsLoading(false);
            }
        };
        
        fetchItem();
    }, []);
    
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
        
        try {
            const response = await fetch(`${API_URI}/1`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedItem)
            });
            
            if (!response.ok) {
                throw new Error('Failed to update item');
            }
            
            const data = await response.json();
            setItem(data);
            setResponse('Item updated successfully!');
            setIsLoading(false);
        } catch (error) {
            setError(error.message);
            setIsLoading(false);
        }
    };
    
    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!item) return <div>No item found</div>;
    
    return (
        <div className="update-item-container">
            <h2>Update Door</h2>
            
            <div className="current-item">
                <h3>Current Door Details</h3>
                <p>ID: {item.id}</p>
                <p>Name: {item.name}</p>
                <p>Description: {item.description}</p>
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
                
                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Updating...' : 'Update Door'}
                </button>
            </form>
            
            {response && <div className="success-message">{response}</div>}
        </div>
    );
};

export default UpdateItem;

