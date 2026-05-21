"use client";
import { useUserLocation } from "@app/utils/context/UserLocationContext";
import React, { useCallback, useEffect, useState } from "react";
import {
  BEZIRK_TO_STADTTEILE,
  bezirke,
  STADTTEILE_TO_BEZIRK,
} from "@app/utils/constants";
import { iBezirk } from "@app/utils/types";
import { fetchLocationData } from "./mapUtils/constants";
import UserStandortIcon from "../@Icons/UserStandortIcon";
import StandortDeniedIcon from "../@Icons/StandortDeniedIcon";
import dynamic from "next/dynamic";

const GeneralMap = dynamic(() => import("@components/@Map/GeneralMap"), {
  ssr: false,
});

const DraggableMarker = dynamic(
  () => import("@components/@Map/DraggableMarker"),
  {
    ssr: false,
  },
);

interface Location {
  lat: number;
  lon: number;
}

const LocationModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const modalBox = React.useRef<HTMLDivElement>(null);
  const [selectedBezirk, setSelectedBezirk] = useState<iBezirk | null>(
    "Hamburg-Mitte",
  );
  const [selectedStadtteil, setSelectedStadtteil] = useState<string | null>(
    null,
  );
  const {
    getUserLocation,
    getStadtteilLocation,
    handleUserLocationStorage,
    userLocation,
    removeUserLocation,
  } = useUserLocation();
  const [currentLocation, setCurrentLocation] = useState<Location | null>(
    userLocation,
  );
  const [searchingLocation, setSearchingLocation] = useState<boolean>(false);
  const [useDefaultPosition, setUseDefaultPosition] = useState<boolean>(true);
  const [geolocationDenied, setGeolocationDenied] = useState<boolean>(false);
  const handleGetLocation = useCallback(() => {
    setSearchingLocation(true);
    getUserLocation()
      .then((location: Location | null) => {
        setCurrentLocation(location);
        setSearchingLocation(false);
      })
      .catch((err) => {
        setGeolocationDenied(true);
        setSearchingLocation(false);
      });
  }, [getUserLocation]);

  const handleRemoveLocation = useCallback(() => {
    removeUserLocation();
    setUseDefaultPosition(false);
    setCurrentLocation(null);
    onClose();
  }, [removeUserLocation, onClose]);

  const onChangePosition = useCallback((location: Location) => {
    setCurrentLocation(location);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      event.stopPropagation();

      if (
        modalBox.current &&
        !modalBox.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

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
        },
      );
    } else if (useDefaultPosition) {
      setCurrentLocation(
        getStadtteilLocation(selectedStadtteil || "Hamburg-Altstadt"),
      );
    }
  }, [
    getStadtteilLocation,
    selectedStadtteil,
    currentLocation,
    useDefaultPosition,
  ]);

  return (
    <div
      id="user-location-modal-container"
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[400] p-2"
    >
      <div
        id="user-location-modal-box"
        ref={modalBox}
        className="relative bg-hh-50 p-6 rounded-lg text-center min-w-80 w-full max-w-full sm:max-w-[600px] max-h-[80vh] flex flex-col items-center gap-1 text-hh-800"
      >
        <button
          className="w-4 h-4 hover:text-white flex justify-center items-center rounded-full hover:bg-hh-800 hover:font-bold absolute top-2 right-2 font-semibold transition-colors duration-500"
          onClick={onClose}
        >
          ×
        </button>
        <div>
          <h2 className="text-xl mb-1 font-semibold px-4 leading-none">
            {userLocation
              ? "Möchtest du deinen Standort ändern?"
              : "Wähle einen Standort aus"}
          </h2>
        </div>
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
                setCurrentLocation(getStadtteilLocation(e.target.value));
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
        <button
          className={`flex items-center gap-2 text-sm px-2 py-1 bg-hh-800 text-hh-50 rounded-md hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${geolocationDenied ? "disabled:bg-red-600 disabled:text-white disabled:hover:bg-red-600" : ""}`}
          disabled={searchingLocation || geolocationDenied}
          onClick={() => handleGetLocation()}
        >
          {geolocationDenied ? (
            <StandortDeniedIcon color="#f0f1f2 " size="1rem" />
          ) : (
            <UserStandortIcon color="#f0f1f2 " size="1rem" />
          )}
          <span>
            {searchingLocation
              ? "Standort wird gesucht..."
              : geolocationDenied
                ? "Standortzugriff verweigert"
                : "Aktuellen Standort verwenden"}
          </span>
        </button>

        <div className="w-full aspect-square max-h-[60vh] bg-hh-800 rounded-lg p-1 sm:p-2 my-2 flex flex-col gap-2 overflow-hidden">
          <GeneralMap showUserLocation={false}>
            {currentLocation && (
              <DraggableMarker
                pos={currentLocation}
                onChangePosition={onChangePosition}
              />
            )}
          </GeneralMap>
        </div>
        <div className="w-full flex flex-wrap items-stretch justify-around gap-1">
          <button
            className="text-sm font-semibold max-w-[40%] bg-positive-600 text-white py-2 px-4 rounded-md hover:bg-positive-700"
            onClick={() => {
              handleUserLocationStorage(currentLocation);
              onClose();
            }}
          >
            Speichern
          </button>
          <button
            className="text-sm font-semibold max-w-[40%] bg-negative-600 text-white py-2 px-4 rounded-md hover:bg-negative-700 leading-none"
            onClick={() => {
              handleRemoveLocation();
            }}
          >
            {userLocation ? "Standort löschen" : "Abbrechen"}
          </button>
        </div>
        <p className="text-xs text-hh-600">
          Dein Standort {userLocation ? "wird" : "ist"} nur lokal in deinem
          Browser gespeichert und nicht geteilt.
        </p>
      </div>
    </div>
  );
};

const UserLocationButton: React.FC<{ dark?: boolean; minimal?: boolean }> = ({
  dark,
  minimal,
}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const handleModal = useCallback((open: boolean) => {
    setIsModalOpen(open);
  }, []);
  const { userLocation } = useUserLocation();
  return (
    <>
      <button
        className={`max-w-28 h-8 flex gap-1 userLocationButton bg-hh-800 text-hh-50 ${dark ? "bg-opacity-75 hover:bg-opacity-80" : "bg-opacity-25  hover:bg-opacity-30"} hover:shadow-xl active:bg-opacity-40 min-w-8 py-1 px-2 rounded-md hover:gap-1 items-center text-sm transition-all duration-500 shadow-lg`}
        onClick={(e) => {
          e.stopPropagation();
          handleModal(true);
        }}
      >
        <span className="min-w-4 h-4">
          <UserStandortIcon color="#f0f1f2 " size="1rem" />
        </span>

        {!userLocation && (
          <span
            className={`text-xs font-semibold leading-none ${minimal ? "hidden sm:block" : ""}`}
          >
            Standort auswählen
          </span>
        )}
      </button>

      {isModalOpen && (
        <LocationModal
          onClose={() => {
            handleModal(false);
          }}
        />
      )}
    </>
  );
};

export default UserLocationButton;
