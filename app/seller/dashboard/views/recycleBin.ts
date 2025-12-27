export const getRecycleBinHTML = () => `
    <div class="recycle-bin-container">
        <h2>Recycle Bin</h2>
        <p>This is where your deleted billboards will appear.</p>
        <div id="recycle-bin-list">
            <!-- Billboards will be loaded here -->
            <div class="loading-spinner">Loading recycled billboards...</div>
        </div>
    </div>
`;
