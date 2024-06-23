import { useState, useEffect } from "react";
import first from "./content/1st.png";
import second from "./content/2nd.png";
import third from "./content/3rd.png";

function List() {
  const [data, setData] = useState([]);

  useEffect(() => {
    getData();
  }, []);
  const getData = async () => {
    try {
      const response = await fetch("http://localhost:3000/data/get");
      const jsonData = await response.json();
      jsonData.sort((a: { score: number }, b: { score: number }) => {
        return b.score - a.score;
      });
      setData(jsonData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    setNewData();
  }, [data]);
  const setNewData = async () => {
    const ws = new WebSocket("ws://localhost:3000/data/get");

    ws.onmessage = (event) => {
      const newData = JSON.parse(event.data);
      updateData(newData);
      console.log("updated data updated on frontend");
    };
  };
  const updateData = async (newData: any) => {
    setData((prevData: any) => {
      const updatedData = prevData.map((item: any) => {
        if (item._id === newData.documentKey._id) {
          return {
            ...item,
            score: newData.updateDescription.updatedFields.score,
          };
        }
        return item;
      });
      return updatedData;
    });
  };

  return (
    <>
      <table className="table table-striped">
        <thead className="border-start-0 border-end-0 border-top-0 border-3 border-warning">
          <tr>
            <th className="text-primary" scope="col">
              RANK
            </th>
            <th className="text-primary" scope="col">
              TEAM NAME
            </th>
            <th scope="col" className="text-center text-primary">
              TOTAL GAMES PLAYED
            </th>
            <th scope="col" className="text-center text-primary">
              SCORE
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td className="text-center">
                {index == 0 && (
                  <img
                    className="img img-fluid rounded-circle"
                    src={first}
                    style={{ width: "40px" }}
                  ></img>
                )}
                {index == 1 && (
                  <img
                    className="img img-fluid rounded-circle"
                    src={second}
                    style={{ width: "40px" }}
                  ></img>
                )}
                {index == 2 && (
                  <img
                    className="img img-fluid rounded-circle"
                    src={third}
                    style={{ width: "40px" }}
                  ></img>
                )}
                {index > 2 && <>{index + 1}</>}
              </td>

              <td>
                <img
                  className="img img-fluid rounded-circle p-2"
                  src={item["profile"]}
                  style={{ width: "40px" }}
                ></img>
                {item["team_name"]}
              </td>
              <td className="text-center">
                {JSON.stringify(item["total_games"])}
              </td>
              <td className="text-center">{JSON.stringify(item["score"])}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default List;
