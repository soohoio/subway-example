import './App.css';

import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import RouteSummaryCard from "@/components/RouteSummaryCard.tsx"
import { fetchSubwayPath } from "@/lib/odsay-api";

const STATION_LIST = ["서울역", "시청", "을지로입구", "종각", "종로3가", "충무로", "동대문"];

function App() {
  const [fromStation, setFromStation] = useState("");
  const [toStation, setToStation] = useState("");
  const [isFromOpen, setIsFromOpen] = useState(false);
  const [isToOpen, setIsToOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [pathData, setPathData] = useState<any | null>(null);

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
      <header className="bg-gray-100 p-4 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-4">
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
          <Button variant="outline" onClick={ async () => {
            if (fromStation && toStation) {
              const path = await fetchSubwayPath(fromStation, toStation);
              setPathData(path);
            }
          }}>조회</Button>
        </div>
      </header>

      <section className="bg-white p-4 border-b text-sm text-gray-800 space-y-1">
        {/*<div>소요시간: {path.info.totalTime > 0 ? `${path.info.totalTime}분` : "-"}</div>*/}
        {/*<div>정차역: {stations.length ? stations.join(" → ") : "-"}</div>*/}
        {/*<div>환승: {transfers.length ? transfers.join(", ") : "-"}</div>*/}
        { pathData && <RouteSummaryCard path={pathData} /> }
      </section>

      <main className="flex-1 overflow-auto p-4 bg-gray-50">
        <div className="relative">
          <img
              src="/subway-map.jpeg"
              alt="Subway Map"
              className="w-full"
          />
        </div>
      </main>

      <Dialog open={isFromOpen} onOpenChange={setIsFromOpen}>
        <DialogContent>
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
        </DialogContent>
      </Dialog>

      <Dialog open={isToOpen} onOpenChange={setIsToOpen}>
        <DialogContent>
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
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default App