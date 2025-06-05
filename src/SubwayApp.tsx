import { useState, useEffect } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

const STATION_LIST = ["서울역", "시청", "을지로입구", "종각", "종로3가", "충무로", "동대문"];

// 예시 API 응답 형태
const mockAPIResponse = {
  duration: 18,
  stations: ["서울역", "시청", "을지로입구", "종각"],
  transfers: ["2호선"]
};

export default function SubwayApp() {
  const [fromStation, setFromStation] = useState("");
  const [toStation, setToStation] = useState("");
  const [isFromOpen, setIsFromOpen] = useState(false);
  const [isToOpen, setIsToOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<string[]>([]);

  const [duration, setDuration] = useState(0);
  const [stations, setStations] = useState<string[]>([]);
  const [transfers, setTransfers] = useState<string[]>([]);

  useEffect(() => {
    if (fromStation && toStation) {
      // 실제 철도공사 API를 여기에 연동 가능
      // 예: fetch(`/api/route?from=${fromStation}&to=${toStation}`)
      const res = mockAPIResponse;
      setDuration(res.duration);
      setStations(res.stations);
      setTransfers(res.transfers);
    }
  }, [fromStation, toStation]);

  const handleSearch = (query: string) => {
    const filtered = STATION_LIST.filter((station) =>
      station.includes(query)
    );
    setSearchResults(filtered);
  };

  const selectStation = (station: string, isFrom: boolean) => {
    if (isFrom) {
      setFromStation(station);
      setIsFromOpen(false);
    } else {
      setToStation(station);
      setIsToOpen(false);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-gray-100 p-4 flex justify-between items-center">
        <div className="flex gap-4 flex-wrap">
          <Button variant="outline" onClick={() => {
            setIsFromOpen(true);
            setSearchQuery("");
            setSearchResults([]);
          }}>
            출발역: {fromStation || "선택"}
          </Button>
          <Button variant="outline" onClick={() => {
            setIsToOpen(true);
            setSearchQuery("");
            setSearchResults([]);
          }}>
            도착역: {toStation || "선택"}
          </Button>
        </div>
      </header>

      <section className="bg-white p-4 border-b text-sm text-gray-800 space-y-1">
        <div>소요시간: {duration > 0 ? `${duration}분` : "-"}</div>
        <div>정차역: {stations.length ? stations.join(" → ") : "-"}</div>
        <div>환승: {transfers.length ? transfers.join(", ") : "-"}</div>
      </section>

      <main className="flex-1 overflow-auto p-4 bg-gray-50">
        <div className="relative">
          <img
            src="/subway-map.png"
            alt="Subway Map"
            className="w-full"
          />
          {/* 경로 하이라이팅 (예시) */}
          <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
            {stations.map((station, idx) => (
              <circle
                key={station}
                cx={(100 + idx * 100).toString()} // 예시 좌표
                cy="100"
                r="8"
                fill="red"
                stroke="white"
                strokeWidth="2"
              />
            ))}
          </svg>
        </div>
      </main>

      <Dialog open={isFromOpen} onOpenChange={setIsFromOpen}>
        <div className="p-4 space-y-2">
          <label className="block text-sm font-medium">출발역 검색</label>
          <div className="flex gap-2">
            <Input
              value={searchQuery}
              placeholder="역 이름 입력"
              onChange={(e) => {
                const q = e.target.value;
                setSearchQuery(q);
                handleSearch(q);
              }}
            />
            <Button variant="outline" onClick={() => handleSearch(searchQuery)}>
              <Search className="w-4 h-4" />
            </Button>
          </div>
          <div className="max-h-48 overflow-auto border rounded-md">
            {searchResults.map((station) => (
              <div
                key={station}
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => selectStation(station, true)}
              >
                {station}
              </div>
            ))}
          </div>
        </div>
      </Dialog>

      <Dialog open={isToOpen} onOpenChange={setIsToOpen}>
        <div className="p-4 space-y-2">
          <label className="block text-sm font-medium">도착역 검색</label>
          <div className="flex gap-2">
            <Input
              value={searchQuery}
              placeholder="역 이름 입력"
              onChange={(e) => {
                const q = e.target.value;
                setSearchQuery(q);
                handleSearch(q);
              }}
            />
            <Button variant="outline" onClick={() => handleSearch(searchQuery)}>
              <Search className="w-4 h-4" />
            </Button>
          </div>
          <div className="max-h-48 overflow-auto border rounded-md">
            {searchResults.map((station) => (
              <div
                key={station}
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => selectStation(station, false)}
              >
                {station}
              </div>
            ))}
          </div>
        </div>
      </Dialog>
    </div>
  );
}

