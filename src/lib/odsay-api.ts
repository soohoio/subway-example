// Odsay API 연동 예제: 출발역, 도착역 기준 경로 검색 (지하철 전용)
// Note: 실제 서비스 사용 전에는 https://www.odsay.com 에서 API Key 발급 필요

// const apiKey = encodeURIComponent(import.meta.env.VITE_ODSAY_KEY)

export async function fetchSubwayPath(from: string, to: string) {
    const coords = await Promise.all([
        getStationCoord(from),
        getStationCoord(to),
    ]);

    const [fromCoord, toCoord] = coords;
    const url = `https://odsay.bankchain.dev/v1/api/searchPubTransPathT?SX=${fromCoord.x}&SY=${fromCoord.y}&EX=${toCoord.x}&EY=${toCoord.y}&SearchType=0`;

    const res = await fetch(url);
    const data = await res.json();

    // 버스가 포함되지 않은 (지하철 + 도보만 있는) 경로 필터링
    const path = data.result.path.find((p: any) =>
        p.subPath.every((sp: any) => sp.trafficType !== 2)
    );

    console.dir(path)
    return path;
}

// 역 이름으로 좌표 가져오기
export async function getStationCoord(stationName: string): Promise<{ x: number; y: number }> {
    console.log(`stationName: ${stationName}`)
    const query = encodeURIComponent(stationName);

    const url = `https://odsay.bankchain.dev/v1/api/searchStation?stationName=${query}`;


    const res = await fetch(url);
    const data = await res.json();

    const station = data.result.station[0];
    console.log(`station: ${JSON.stringify(station)}`)
    return { x: station.x, y: station.y };
}
