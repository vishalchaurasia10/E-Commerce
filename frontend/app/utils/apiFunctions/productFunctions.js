export const uploadProductImages = async (file) => {
    try {
        if (!file) {
            return { status: 'failure', message: 'No file Selected' }
        }
        const formData = new FormData();
        formData.append('files', file);
        const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/upload`, {
            method: 'POST',
            body: formData,
        });
        if (result.status === 200) {
            const data = await result.json();
            return { status: 'success', message: data.message, fileId: data.fileId };
        } else {
            return { status: 'failure', message: 'Error uploading file' };
        }
    } catch (error) {
        return { status: 'failure', message: error.message };
    }
}

export const uploadProductDocument = async (title, category, imageId, price, size, color, description, otherDetails, featured) => {
    try {
        const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title, category, imageId, price, size, color, description, otherDetails, featured }),
        });
        const data = await result.json();
        if (result.status === 201) {
            return { status: 'success', message: 'Product uploaded successfully' };
        } else {
            return { status: 'failure', message: data.message }
        }
    } catch (error) {
        return { status: 'failure', message: error.message }
    }
}