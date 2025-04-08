"use client";
import React, { useState, createContext, useContext } from "react";

const locations: { [key: string]: { lat: number; lon: number } } = {
  "Hamburg-Altstadt": {
    lat: 53.55,
    lon: 10,
  },
  HafenCity: {
    lat: 53.543,
    lon: 10,
  },
  Neustadt: {
    lat: 53.54826515961821,
    lon: 9.978850961927664,
  },
  "St. Pauli": {
    lat: 53.55254896772511,
    lon: 9.959280589546774,
  },
  "St. Georg": {
    lat: 53.55513,
    lon: 10.01231,
  },
  Hammerbrook: {
    lat: 53.5456114467716,
    lon: 10.025219928604418,
  },
  Borgfelde: {
    lat: 53.55475,
    lon: 10.03447,
  },
  Hamm: {
    lat: 53.55203984008464,
    lon: 10.052977818401875,
  },
  Horn: {
    lat: 53.55275012098941,
    lon: 10.088862317410099,
  },
  Billstedt: {
    lat: 53.547958906700664,
    lon: 10.121658596429192,
  },
  Billbrook: {
    lat: 53.52461109659825,
    lon: 10.085125226813801,
  },
  Rothenburgsort: {
    lat: 53.535,
    lon: 10.04082,
  },
  Veddel: {
    lat: 53.52398972065751,
    lon: 10.021408440962036,
  },
  Wilhelmsburg: {
    lat: 53.5,
    lon: 10,
  },
  "Kleiner Grasbrook": {
    lat: 53.527250181982126,
    lon: 9.996354924621393,
  },
  Steinwerder: {
    lat: 53.54,
    lon: 9.95,
  },
  Waltershof: {
    lat: 53.51705281911583,
    lon: 9.910006148442331,
  },
  Finkenwerder: {
    lat: 53.52909418684849,
    lon: 9.858482729436219,
  },
  Neuwerk: {
    lat: 53.5,
    lon: 10,
  },
  "Altona-Altstadt": {
    lat: 53.54775455262377,
    lon: 9.94587619367398,
  },
  Sternschanze: {
    lat: 53.56009119590742,
    lon: 9.961501723977035,
  },
  "Altona-Nord": {
    lat: 53.5592,
    lon: 9.9463,
  },
  Ottensen: {
    lat: 53.5512,
    lon: 9.9227,
  },
  Bahrenfeld: {
    lat: 53.56753938781266,
    lon: 9.905554834887297,
  },
  "Groß Flottbek": {
    lat: 53.56397653627226,
    lon: 9.880312277168462,
  },
  Othmarschen: {
    lat: 53.55356877040356,
    lon: 9.8863168784228,
  },
  Lurup: {
    lat: 53.591283273493744,
    lon: 9.873974905303818,
  },
  Osdorf: {
    lat: 53.57172685884814,
    lon: 9.860409488871179,
  },
  Nienstedten: {
    lat: 53.552449841416625,
    lon: 9.8446198344366,
  },
  Blankenese: {
    lat: 53.55766035242478,
    lon: 9.801530878004897,
  },
  Iserbrook: {
    lat: 53.57497140089982,
    lon: 9.829686536070358,
  },
  Sülldorf: {
    lat: 53.580479313036996,
    lon: 9.796724093429804,
  },
  Rissen: {
    lat: 53.5838440496248,
    lon: 9.755855384693595,
  },
  Eimsbüttel: {
    lat: 53.570601919335395,
    lon: 9.950008924374837,
  },
  Rotherbaum: {
    lat: 53.56682659291086,
    lon: 9.98706756424424,
  },
  Harvestehude: {
    lat: 53.57334568567995,
    lon: 9.983124406962466,
  },
  "Hoheluft-West": {
    lat: 53.57854579900256,
    lon: 9.96768623324154,
  },
  Lokstedt: {
    lat: 53.59983466080988,
    lon: 9.958763033885125,
  },
  Niendorf: {
    lat: 53.62509778741325,
    lon: 9.952594485846202,
  },
  Schnelsen: {
    lat: 53.634260395328724,
    lon: 9.920668129937217,
  },
  Eidelstedt: {
    lat: 53.60269835424423,
    lon: 9.914143046796529,
  },
  Stellingen: {
    lat: 53.59433888645815,
    lon: 9.929236833681806,
  },
  "Hoheluft-Ost": {
    lat: 53.582516166707045,
    lon: 9.975757332856508,
  },
  Eppendorf: {
    lat: 53.58934901129878,
    lon: 9.985363985475669,
  },
  "Groß Borstel": {
    lat: 53.60453842870196,
    lon: 9.989635036326618,
  },
  Alsterdorf: {
    lat: 53.60890288507576,
    lon: 10.003224394597689,
  },
  Winterhude: {
    lat: 53.5946446196311,
    lon: 10.004409264949443,
  },
  Uhlenhorst: {
    lat: 53.57018795083308,
    lon: 10.01298736808246,
  },
  Hohenfelde: {
    lat: 53.560400399980175,
    lon: 10.021584447339267,
  },
  "Barmbek-Süd": {
    lat: 53.57783677962583,
    lon: 10.042871344816222,
  },
  Dulsberg: {
    lat: 53.58109065557691,
    lon: 10.061925314290637,
  },
  "Barmbek-Nord": {
    lat: 53.59617490851981,
    lon: 10.046299783987621,
  },
  Ohlsdorf: {
    lat: 53.61776174385612,
    lon: 10.035652522289675,
  },
  Fuhlsbüttel: {
    lat: 53.628351794251515,
    lon: 10.021927770093173,
  },
  Langenhorn: {
    lat: 53.6596891001066,
    lon: 10.004427176991532,
  },
  Eilbek: {
    lat: 53.565193106134984,
    lon: 10.046130073427136,
  },
  Wandsbek: {
    lat: 53.572952688187755,
    lon: 10.076181455211,
  },
  Marienthal: {
    lat: 53.56387260243377,
    lon: 10.08010714381811,
  },
  Jenfeld: {
    lat: 53.573147254093726,
    lon: 10.134855950208195,
  },
  Tonndorf: {
    lat: 53.584752266670236,
    lon: 10.118379118224993,
  },
  "Farmsen-Berne": {
    lat: 53.6069656119998,
    lon: 10.112560011409824,
  },
  Bramfeld: {
    lat: 53.614092600122675,
    lon: 10.078591985713366,
  },
  Steilshoop: {
    lat: 53.60839351586496,
    lon: 10.057646814867766,
  },
  Wellingsbüttel: {
    lat: 53.638729849909716,
    lon: 10.088168844044649,
  },
  Sasel: {
    lat: 53.649928707465016,
    lon: 10.115957592211645,
  },
  Poppenbüttel: {
    lat: 53.65460135149045,
    lon: 10.07412914460646,
  },
  Hummelsbüttel: {
    lat: 53.63669552215045,
    lon: 10.039447871359501,
  },
  "Lemsahl-Mellingstedt": {
    lat: 53.677599034111616,
    lon: 10.085133030079636,
  },
  Duvenstedt: {
    lat: 53.7040223679261,
    lon: 10.105015600824489,
  },
  "Wohldorf-Ohlstedt": {
    lat: 53.69915901555525,
    lon: 10.13525921623169,
  },
  Bergstedt: {
    lat: 53.66965632653837,
    lon: 10.12561319258933,
  },
  Volksdorf: {
    lat: 53.643821168158105,
    lon: 10.167853773565547,
  },
  Rahlstedt: {
    lat: 53.60106542523346,
    lon: 10.15684119809177,
  },
  Lohbrügge: {
    lat: 53.5031546756516,
    lon: 10.20971254749942,
  },
  Bergedorf: {
    lat: 53.4821,
    lon: 10.2296,
  },
  Curslack: {
    lat: 53.44697743458075,
    lon: 10.228956888454174,
  },
  Altengamme: {
    lat: 53.42653349171799,
    lon: 10.2725532030978,
  },
  Neuengamme: {
    lat: 53.433894691744705,
    lon: 10.223804032247369,
  },
  Kirchwerder: {
    lat: 53.41794743265241,
    lon: 10.196037097755399,
  },
  Ochsenwerder: {
    lat: 53.47209423911,
    lon: 10.081346193663512,
  },
  Reitbrook: {
    lat: 53.46741062011017,
    lon: 10.1472638077196,
  },
  Allermöhe: {
    lat: 53.480291279610796,
    lon: 10.124607698206935,
  },
  Billwerder: {
    lat: 53.496835500437086,
    lon: 10.131103696447573,
  },
  Moorfleet: {
    lat: 53.50621582807517,
    lon: 10.083063516820834,
  },
  Tatenberg: {
    lat: 53.49028298713059,
    lon: 10.078294241125942,
  },
  Spadenland: {
    lat: 53.47905266241796,
    lon: 10.064539517294664,
  },
  Neuallermöhe: {
    lat: 53.4790608741351,
    lon: 10.16271829736002,
  },
  Harburg: {
    lat: 53.453508294057485,
    lon: 9.987255186846854,
  },
  Neuland: {
    lat: 53.46454653076488,
    lon: 10.029467569657788,
  },
  "Gut Moor": {
    lat: 53.445953033287495,
    lon: 10.015386193686014,
  },
  Wilstorf: {
    lat: 53.44431474320998,
    lon: 9.986209789400366,
  },
  Rönneburg: {
    lat: 53.43142889181558,
    lon: 10.006452796879877,
  },
  Langenbek: {
    lat: 53.428782500205635,
    lon: 9.988959031635874,
  },
  Sinstorf: {
    lat: 53.42141718106248,
    lon: 9.9731530612818,
  },
  Marmstorf: {
    lat: 53.43706037854612,
    lon: 9.969059435583697,
  },
  Eißendorf: {
    lat: 53.449327545381536,
    lon: 9.959454645107577,
  },
  Heimfeld: {
    lat: 53.4600574417018,
    lon: 9.942636529860366,
  },
  Moorburg: {
    lat: 53.484985377910526,
    lon: 9.935783907844456,
  },
  Altenwerder: {
    lat: 53.502647720358475,
    lon: 9.919449741011626,
  },
  Hausbruch: {
    lat: 53.469453840880576,
    lon: 9.884639635676471,
  },
  "Neugraben-Fischbek": {
    lat: 53.4756,
    lon: 9.8483,
  },
  Francop: {
    lat: 53.5006966308197,
    lon: 9.877690182225091,
  },
  Neuenfelde: {
    lat: 53.516211108374996,
    lon: 9.80730156910235,
  },
  Cranz: {
    lat: 53.533552383399716,
    lon: 9.775738753499706,
  },
};

const UserLocationContext = createContext<any>(null);
export default function UserLocationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // const variable array to save the users location
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lon: number;
  } | null>(
    localStorage.getItem("userLocation")
      ? JSON.parse(localStorage.getItem("userLocation") || "")
      : null
  );

  const handleUserLocation = (
    pos: { lat: number; lon: number } | null,
    stadtteil?: string
  ) => {
    setUserLocation(() => {
      if (pos) {
        localStorage.setItem("locationTimestamp", Date.now().toString());
        localStorage.setItem("userLocation", JSON.stringify(pos));
        return pos;
      }
      if (stadtteil && locations[stadtteil]) {
        localStorage.setItem("locationTimestamp", Date.now().toString());
        localStorage.setItem(
          "userLocation",
          JSON.stringify(locations[stadtteil])
        );
        return locations[stadtteil];
      }
      localStorage.setItem("locationTimestamp", Date.now().toString());
      localStorage.setItem(
        "userLocation",
        JSON.stringify(locations["Hamburg-Altstadt"])
      );
      return locations["Hamburg-Altstadt"];
    });
    return (
      pos ||
      (stadtteil && locations[stadtteil]) ||
      locations["Hamburg-Altstadt"]
    );
  };
  const getUserLocation = () => {
    return new Promise<{ lat: number; lon: number } | null>(
      (resolve, reject) => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const lat = position.coords.latitude;
              const lon = position.coords.longitude;
              if (lat && lon) {
                const location = {
                  lat: lat,
                  lon: lon,
                };
                handleUserLocation(location);
                resolve(location);
              } else {
                setUserLocation(null);
                reject(null);
              }
            },
            (error) => {
              reject(null);
            }
          );
        } else {
          reject(null);
        }
      }
    );
  };
  const removeUserLocation = () => {
    localStorage.removeItem("locationTimestamp");
    localStorage.removeItem("userLocation");
    setUserLocation(null);
  };
  // return an HTML page for the user to check their location
  return (
    <UserLocationContext.Provider
      value={{
        userLocation,
        getUserLocation,
        removeUserLocation,
        handleUserLocation,
      }}
    >
      {children}
    </UserLocationContext.Provider>
  );
}
export const useUserLocation: () => {
  userLocation: {
    lat: number;
    lon: number;
  } | null;
  getUserLocation: () => Promise<{
    lat: number;
    lon: number;
  } | null>;
  removeUserLocation: () => void;
  handleUserLocation: (
    pos: {
      lat: number;
      lon: number;
    } | null,
    stadtteil?: string
  ) => {
    lat: number;
    lon: number;
  };
} = () => {
  return useContext(UserLocationContext);
};
