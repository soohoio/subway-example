// RouteSummaryCard.tsx
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Train } from "lucide-react";

interface SubPath {
    trafficType: number;
    startName: string;
    endName: string;
    stationCount: number;
    lane: { name: string }[];
}

interface PathInfo {
    info: {
        totalTime: number;
        totalStationCount: number;
        busTransitCount: number;
        subwayTransitCount: number;
    };
    subPath: SubPath[];
}

interface Props {
    path: PathInfo;
}

const RouteSummaryCard: React.FC<Props> = ({ path }) => {
    return (
        <Card className="w-full p-4">
            <CardContent className="space-y-2">
                <div className="text-lg font-semibold flex items-center gap-2">
                    <Train className="w-5 h-5" /> 총 소요시간: {path.info.totalTime}분
                </div>

                <div className="text-sm text-gray-700">
                    총 정차역 수: {path.info.totalStationCount}, 환승 횟수: {path.info.subwayTransitCount}
                </div>

                <div className="mt-4 space-y-1 text-sm">
                    {path.subPath.map((sp, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                            <Train className="w-4 h-4 text-indigo-600" />
                            <span>
                                {sp.startName} → {sp.endName} ({sp.stationCount}개역)
                            </span>
                            {/*{idx !== 0 && (*/}
                            {/*    <span className="flex items-center text-xs text-gray-500">*/}
                            {/*        <RefreshCw className="w-3 h-3 mr-1" /> {sp.lane[0]?.name} 환승*/}
                            {/*    </span>*/}
                            {/*)}*/}
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

export default RouteSummaryCard;