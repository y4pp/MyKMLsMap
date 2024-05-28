// Copyright (c) 2024 YA-androidapp(https://github.com/yzkn) All rights reserved.


var map;

const initMap = () => {
    map = L.map('map');

    var slopemap = L.tileLayer('https://cyberjapandata.gsi.go.jp/xyz/slopemap/{z}/{x}/{y}.png', {
        attribution: "<a href='https://maps.gsi.go.jp/development/ichiran.html' target='_blank'>地理院タイル</a>", minZoom: 3, maxZoom: 15
    }).addTo(map);

    var pale = L.tileLayer('http://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png', {
        attribution: "<a href='https://maps.gsi.go.jp/development/ichiran.html' target='_blank'>地理院タイル</a>", minZoom: 2, maxZoom: 18
    });

    var baseMaps = {
        "傾斜量図": slopemap,
        "淡色地図": pale
    };
    L.control.layers(baseMaps).addTo(map);

    map.setView([35.91685961322499, 138.71269226074222], 7);
    loadKmls();
}

const listKmlFiles = async () => {
    GitHubName = "yzkn"
    GitHubRepo = "MyKMLsMap"
    GitHubPath = "kml"
    header_auth = { "Accept": "application/vnd.github.v3+json" };

    git_url = `https://api.github.com/repos/${GitHubName}/${GitHubRepo}/contents/${GitHubPath}`;
    files = await fetch(git_url, { method: "GET", headers: header_auth }).then(d => d.json());

    return files;
}

const loadKmls = async () => {
    let files = await listKmlFiles();

    function loadKml(download_url) {
        return new Promise((resolve) => {
            omnivore.kml(download_url, null, L.geoJson(null, { style: { color: 'red', weight: 1, opacity: 1 }, }))
                .on('ready', function () {
                    resolve();
                })
                .addTo(map);
        });
    }
    // await Promise.all(
    //     files.map(async (file) => {
    //         await loadKml(file.download_url);
    //     })
    // );
    await files.reduce((promise, file) => {
        return promise.then(async () => {
            await loadKml(file.download_url);
        });
    }, Promise.resolve());
}

window.addEventListener('DOMContentLoaded', (event) => {
    initMap();
});
