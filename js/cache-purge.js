const cachePurge = async () => {
    await chrome.storage.local.clear();
    console.log('Cache purged');
}


document.getElementById('cache-purge-button').addEventListener('click', cachePurge);