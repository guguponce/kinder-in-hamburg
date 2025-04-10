"use client";
import { useUserLocation } from "@app/utils/context/UserLocationContext";
import React, { use, useCallback, useEffect, useState } from "react";
import GeneralMap from "./GeneralMap";
import DraggableMarker from "./DraggableMarker";
import {
  BEZIRK_TO_STADTTEILE,
  bezirke,
  STADTTEILE_TO_BEZIRK,
} from "@app/utils/constants";
import { iBezirk } from "@app/utils/types";
import { haversineDistance } from "@app/utils/functions";
import { fetchLocationData } from "./mapUtils/constants";

const MemoGeneralMap = React.memo(GeneralMap);
// Type definitions for the props and location object
interface Location {
  lat: number;
  lon: number;
}

const LocationModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [selectedBezirk, setSelectedBezirk] = useState<iBezirk | null>(
    "Hamburg-Mitte"
  );
  const [selectedStadtteil, setSelectedStadtteil] = useState<string | null>(
    null
  );
  const [locationInfo, setLocationInfo] = useState<{
    bezirk: string;
    stadtteil: string;
  } | null>(null);
  const {
    getUserLocation,
    handleUserLocation,
    userLocation,
    removeUserLocation,
  } = useUserLocation();
  const [currentLocation, setCurrentLocation] = useState<Location | null>(
    userLocation
  );
  const [acceptedLocationUse, setAcceptedLocationUse] =
    useState<boolean>(!!userLocation);
  const handleGetLocation = useCallback(() => {
    setAcceptedLocationUse(true);
    if (!userLocation) {
      getUserLocation()
        .then((location: Location | null) => {
          setCurrentLocation(location);
        })
        .catch((err) => {});
    }
  }, [getUserLocation, userLocation]);
  const getStadtteilCoordinates = useCallback(
    async (stadtteil: string) => {
      const location = handleUserLocation(null, stadtteil);
      setCurrentLocation(location);
    },
    [handleUserLocation]
  );
  const handleRemoveLocation = useCallback(() => {
    removeUserLocation();
    setCurrentLocation(null);
  }, [removeUserLocation]);

  const onChangePosition = useCallback(
    (location: Location) => {
      setCurrentLocation(location);
      handleUserLocation(location);
    },
    [handleUserLocation]
  );

  useEffect(() => {
    if (currentLocation) {
      fetchLocationData(currentLocation.lat, currentLocation.lon).then(
        (stadtteil) => {
          const bezirk = STADTTEILE_TO_BEZIRK[stadtteil];
          if (bezirk && bezirke.includes(bezirk)) {
            setSelectedBezirk(bezirk as iBezirk);
            if (stadtteil) {
              setSelectedStadtteil(stadtteil);
            }
          }
        }
      );
    }
  }, [currentLocation]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[500] p-2">
      <div className="bg-hh-50 p-6 rounded-lg text-center min-w-80 w-full max-w-full sm:max-w-[600px] max-h-[80vh] flex flex-col items-center gap-1">
        <div>
          <h2 className="text-xl mb-1 font-semibold">
            Möchtest du deinen Standort nutzen?
          </h2>
          <p className="text-xs text-hh-600">
            Deine Position wird nur im Browser gespeichert und nicht an den
            Server gesendet.
          </p>
          <p className="text-xs text-hh-600">
            Sie wird verwendet, um dir relevante Informationen anzuzeigen und
            wird nach 7 Tagen gelöscht.
          </p>
        </div>
        {acceptedLocationUse && (
          <div className="bg-hh-100 bg-opacity-25 text-hh-50 flex items-center gap-x-2 gap-y-1 justify-center flex-wrap">
            <div>
              <label
                htmlFor="bezirk"
                className="block text-sm font-semibold text-hh-700"
              >
                Bezirk
              </label>
              <select
                id="bezirk"
                name="bezirk"
                value={selectedBezirk || "Hamburg-Mitte"}
                className="block w-full border-hh-800 bg-hh-700 rounded-md shadow-sm focus:ring-hh-500 focus:border-hh-500 p-1"
                onChange={(e) => {
                  setSelectedBezirk(e.target.value as iBezirk);
                }}
              >
                {bezirke.map((bezirk) => (
                  <option key={bezirk} value={bezirk}>
                    {bezirk}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="stadtteil"
                className="block text-sm font-semibold text-hh-700"
              >
                Stadtteil
              </label>
              <select
                disabled={!selectedBezirk}
                id="stadtteil"
                name="stadtteil"
                value={selectedStadtteil || "Hamburg-Altstadt"}
                className="block w-full border-hh-800 bg-hh-700 rounded-md shadow-sm focus:ring-hh-500 focus:border-hh-500 p-1"
                onChange={(e) => {
                  setSelectedStadtteil(e.target.value);
                  getStadtteilCoordinates(e.target.value);
                }}
              >
                {selectedBezirk &&
                  BEZIRK_TO_STADTTEILE[selectedBezirk].map((stadtteil) => (
                    <option key={stadtteil} value={stadtteil}>
                      {stadtteil}
                    </option>
                  ))}
              </select>
            </div>
          </div>
        )}

        {currentLocation && (
          <div className="w-full aspect-square max-h-[60vh] bg-hh-800 rounded-lg p-1 sm:py-2 my-2 flex flex-col gap-2 overflow-hidden">
            <MemoGeneralMap centerUserLocation>
              {currentLocation && (
                <DraggableMarker
                  pos={currentLocation}
                  onChangePosition={onChangePosition}
                />
              )}
            </MemoGeneralMap>
          </div>
        )}
        <div className="flex flex-wrap items-stretch justify-around gap-1">
          <button
            className="max-w-[40%] bg-hh-500 text-white py-2 px-4 rounded-md hover:bg-hh-600"
            onClick={currentLocation ? onClose : handleGetLocation}
          >
            {currentLocation ? "Speichern" : "Standort verwenden"}{" "}
          </button>
          <button
            className="max-w-[40%] bg-negative-500 text-white py-2 px-4 rounded-md hover:bg-negative-600"
            onClick={currentLocation ? handleRemoveLocation : onClose}
          >
            {currentLocation ? "Standort entfernen" : "Abbrechen"}
          </button>
        </div>
      </div>
    </div>
  );
};

const UserLocationButton: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const handleModal = useCallback((open: boolean) => {
    setIsModalOpen(open);
  }, []);
  const { userLocation } = useUserLocation();
  return (
    <div>
      <button
        className="bg-hh-500 text-hh-50 py-2 px-4 rounded-md hover:bg-hh-600"
        onClick={() => handleModal(true)}
      >
        {userLocation ? "Standort ändern" : "Standort verwenden"}
      </button>

      {isModalOpen && <LocationModal onClose={() => handleModal(false)} />}
    </div>
  );
};

export default UserLocationButton;
