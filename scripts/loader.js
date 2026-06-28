export async function loadStory(storyPath) {
    try {
        const response = await fetch(storyPath);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Failed loading story data configuration:", error);
        return null;
    }
}