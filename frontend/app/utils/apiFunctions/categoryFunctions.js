export const uploadCategoryDocument = async (title, coverImageId, type) => {
    try {
        const category = {
            title: title,
            coverImageId: coverImageId,
            type: type,
        };
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(category),
        });
        const data = await response.json();
        if (response.status === 201) {
            return { status: 'success', message: 'Category created successfully' }
        } else {
            return { status: 'failure', message: data.message }
        }
    } catch (error) {
        return { status: 'failure', message: error.message }
    }
}

export const uploadCategoryFile = async (file) => {
    try {

        if (!file) {
            return { status: 'failure', message: 'No file Selected' }
        }

        const formData = new FormData();
        formData.append('file', file);

        const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/upload`, {
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
};

export const getCategories = async (parameter, query) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/search?${parameter}=${query}`);
        const data = await response.json();
        if (response.status === 200) {
            return { status: 'success', message: 'Categories fetched successfully', categories: data };
        } else {
            return { status: 'failure', message: data.message };
        }
    } catch (error) {
        return { status: 'failure', message: error.message };
    }
}

export const getCategoryByType = async (type) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/type/${type}`);
        const data = await response.json();
        if (response.status === 200) {
            return { status: 'success', message: 'Categories fetched successfully', categories: data };
        } else {
            return { status: 'failure', message: data.message };
        }
    } catch (error) {
        return { status: 'failure', message: error.message };
    }
}

export const getAllCategories = async () => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/`);
        const data = await response.json();
        if (response.status === 200) {
            return { status: 'success', message: 'Categories fetched successfully', categories: data };
        } else {
            return { status: 'failure', message: data.message };
        }
    } catch (error) {
        return { status: 'failure', message: error.message };
    }
}
