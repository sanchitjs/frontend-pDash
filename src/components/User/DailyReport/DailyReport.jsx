import React, { useState, useEffect } from 'react';
import { useLoaderData } from 'react-router-dom';
import { CircularProgressbarWithChildren } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { fetchPlantIDAndPlantNameFromFirestore } from '../../../auth.js';
import { utils, writeFile } from "xlsx"
import { months } from '../../Calender/calender.js';

const DailyReport = () => {

  // const route = "http://192.168.1.6:5000";
  // const route = "https://lambent-gaufre-c69eec.netlify.app/";
  const route = "https://pdash-backend.onrender.com";

  const { currUser } = useLoaderData();
  const [plantID, setPlantID] = useState("Plant0");
  const [plantName, setPlantName] = useState(" ");
  const [dailyReport, setDailyReport] = useState([{}]);
  const [monthlyReport, setMonthlyReport] = useState([{}]);
  //daily
  const [dailyDateAndTime, setDailyDateAndTime] = useState(null);
  const [dailyRI, setDailyRI] = useState(null);
  const [dailyWR, setDailyWR] = useState(null);
  const [dailyNE, setDailyNE] = useState(null);
  const [dailyOE, setDailyOE] = useState(null);
  //monthly
  const [noOfDays, setNoOfDays] = useState(0);
  const [RI, setRI] = useState(null);
  const [WR, setWR] = useState(null);
  const [NE, setNE] = useState(null);
  const [OE, setOE] = useState(null);

  console.log(RI,WR,NE,OE,noOfDays)
  console.log("monthlyReport",monthlyReport)

  const setDataFromDailyReport = () => {

    console.log("insidesetDataFromDailyReport")

    let tempDailyRI = NaN;
    let tempDailyWR = NaN;
    let tempDailyNE = "";
    let tempDailyOE = "";
    let tempDailyDateAndTime = "";

    Object.keys(dailyReport).forEach((key) => {
      tempDailyDateAndTime = key;
    })

    Object.values(dailyReport).forEach((value) => {
      tempDailyRI = value.RI;
      tempDailyWR = value.WR;
      tempDailyNE = value.NE;
      tempDailyOE = value.OE;
    })

    return { tempDailyRI, tempDailyWR, tempDailyNE, tempDailyOE, tempDailyDateAndTime }
  }

  const setDataFromMonthlyReport = () => {

    console.log("insidesetDataFromMonthlyReport")

    let tempRI = NaN;
    let tempWR = NaN;
    let tempNE = NaN;
    let tempOE = NaN;
    let tempNoOfDays = NaN;

    const keys = Object.keys(monthlyReport);

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      if (parseInt(key.split(' ')[0].split('-')[1]) === new Date().getMonth() + 1) {
        const val = monthlyReport[key]
        if (!(JSON.stringify(val) === '{}' && val.constructor === Object)) {
          if (isNaN(tempRI) && isNaN(tempWR) && isNaN(tempNE) && isNaN(tempOE) && isNaN(tempNoOfDays)) {
            tempRI = tempWR = tempNE = tempOE = tempNoOfDays = 0;
          }
          console.log(val)
          tempRI = val.RI
          tempNE += ((val.NE) ? val.NE.split(",").length : 0)
          tempOE += ((val.OE) ? val.OE.split(",").length : 0)
          tempWR += val.WR
          tempNoOfDays += 1;
        }
      }
      continue;
    }
    return { tempRI, tempWR, tempNE, tempOE, tempNoOfDays }
  }

  console.log("dailyDateandTime",dailyDateAndTime)

  const handleDownloadDailyReport = () => {

    const formattedDate = dailyDateAndTime.split(' ')[0].split('-')[2] + "-" + dailyDateAndTime.split(' ')[0].split('-')[1] + "-" + dailyDateAndTime.split(' ')[0].split('-')[0] + " " + dailyDateAndTime.split(' ')[1];

    const exportingArr = [{
      Date_and_Time: formattedDate,
      Robots_Installed: dailyRI,
      Working_Robots: dailyWR,
      Network_Error: dailyNE ? dailyNE.split(',').length : 0,
      Other_Error: dailyOE ? dailyOE.split(',').length : 0
    }]

    console.log(exportingArr);
    const ws = utils.json_to_sheet(exportingArr)
    const wb = utils.book_new()

    utils.book_append_sheet(wb, ws, "Sheet1");

    writeFile(wb, `Daily Report - ${formattedDatef}.xlsx`)
  }

  const handleDownloadMonthlyReport = () => {

    const exportingArr = [];

    const keys = Object.keys(monthlyReport);

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      if (parseInt(key.split(' ')[0].split('-')[1]) === new Date().getMonth() + 1) {
        const val = monthlyReport[key]
        exportingArr.push({
          Date_and_Time: key.split(' ')[0].split('-')[2] + "-" + key.split(' ')[0].split('-')[1] + "-" + key.split(' ')[0].split('-')[0] + " " + key.split(' ')[1],
          Robots_Installed: val.RI,
          Working_Robots: val.WR,
          Network_Error: val.NE ? val.NE.split(',').length : 0,
          Other_Error: val.OE ? val.OE.split(',').length : 0
        })
      }
      continue;
    }

    const ws = utils.json_to_sheet(exportingArr)
    const wb = utils.book_new()

    utils.book_append_sheet(wb, ws, "Sheet1");

    writeFile(wb, `Monthly Report - ${months[month]} ${year}.xlsx`)
  }

  useEffect(() => {
    const fetchData = async () => {
      if (currUser) {
        const { plantID, plantName } = await fetchPlantIDAndPlantNameFromFirestore(currUser.uid);
        setPlantID(plantID)
        setPlantName(plantName)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    const fetchDailyReport = async () => {
      if (plantID !== "Plant0") {
        const res = await fetch(`${route}/get-daily-report/${plantID}`)
        const data = await res.json()
        data === null ? setDailyReport(0) : setDailyReport(data)
      }
    }
    fetchDailyReport();
  }, [plantID])

  useEffect(() => {
    const fetchMonthlyReport = async () => {
      const res = await fetch(`${route}/get-monthly-report/${plantID}`)
      const data = await res.json()
      data === null ? setMonthlyReport(0) : setMonthlyReport(data)
    }
    fetchMonthlyReport();
  }, [plantID])

  useEffect(() => {
    if (monthlyReport) {
      const { tempRI, tempWR, tempNE, tempOE, tempNoOfDays } = setDataFromMonthlyReport()
      setRI(tempRI);
      setWR(tempWR);
      setNE(tempNE);
      setOE(tempOE);
      setNoOfDays(tempNoOfDays);
    }
  }, [monthlyReport])

  useEffect(() => {
    if (dailyReport && !Object.keys(dailyReport).includes('0')) {
      const { tempDailyRI, tempDailyWR, tempDailyNE, tempDailyOE, tempDailyDateAndTime } = setDataFromDailyReport();
      setDailyRI(tempDailyRI);
      setDailyWR(tempDailyWR);
      setDailyNE(tempDailyNE);
      setDailyOE(tempDailyOE);
      setDailyDateAndTime(tempDailyDateAndTime);
    }
  }, [dailyReport])

  useEffect(() => {
    console.log(dailyNE,dailyOE,dailyRI,dailyDateAndTime,dailyWR)
  }, [dailyNE,dailyOE,dailyRI,dailyDateAndTime,dailyWR])

  useEffect(() => {
    console.log(RI, WR, NE, OE, noOfDays)
  }, [RI, WR, OE, NE, noOfDays])

  useEffect(() => {
    console.log(monthlyReport)
  }, [monthlyReport])

  const currDate = new Date();
  const day = currDate.getDate();
  const month = currDate.getMonth();
  const year = currDate.getFullYear();
  const overallEfficiency = (isNaN(WR) || isNaN(RI) || isNaN(noOfDays)) ? 0 : Math.round((WR / (noOfDays * RI)) * 100)

  return (
    <div className=' h-[81vh] w-[95%] m-auto my-4'>
      <div className='first-div flex justify-between items-end mx-5 mb-2'>
        <div className='text-3xl'>{(plantName === " ") ? "Loading..." : plantName}</div>
        {/* <div className='text-3xl'>{"Magnet, Punjab (50MW)"}</div> */}
        <div className='flex gap-2 items-center'>
          <div onClick={handleDownloadDailyReport} className='text-sm bg-[#fea920] py-1 px-3 rounded-lg cursor-pointer transition-all duration-300 font-semibold hover:bg-[#fed220]'>{`Download Daily Report`}</div>
          <div onClick={handleDownloadMonthlyReport} className='text-sm bg-[#fea920] py-1 px-3 rounded-lg cursor-pointer transition-all duration-300 font-semibold hover:bg-[#fed220]'>{`Download Monthly Report`}</div>
          {/* <div className='text-lg'>{`Welcome ${userName}`}</div> */}
        </div>

      </div>

      <div className='second-div bg-[#cfcfcf] h-[35%] rounded-lg flex flex-col mb-3'>
        {(dailyReport === 0) ?
          <>
            <div className='flex h-full items-center justify-center'>
              <div className='bg-[rgb(255,0,0)] text-white border-[1px] shadow-[0_0px_20px_1px_rgba(0,0,0,0.29)] text-center px-3 py-1 ml-3 rounded-md text-2xl'>NOTE: The Daily Report will be updated only after 2 hours of the scheduled time </div>
            </div></> :

          Object.entries(dailyReport).map(([dateAndTime, val]) => (

            <div className='flex justify-between gap-7 p-5 h-full'>
              <div className=' w-full h-full flex flex-col rounded-lg gap-2'>
                <div className='h-fit px-2'>
                  <div className='text-[40px] leading-[1.25]'>Daily Report</div>
                  {
                    (dailyDateAndTime) ?
                      <div className='font-medium text-lg leading-[1.25]'>{`${dailyDateAndTime.split("-")[2].split(" ")[0]} ${months[dailyDateAndTime.split("-")[1].split("")[1] - 1]} ${"20" + dailyDateAndTime.split("-")[0]} - 
                  ${parseInt(dailyDateAndTime.split("-")[2].split(" ")[1].split(":")[0]) > 12 ? parseInt(dailyDateAndTime.split("-")[2].split(" ")[1].split(":")[0]) - 12 : dailyDateAndTime.split("-")[2].split(" ")[1].split(":")[0]}:${dailyDateAndTime.split("-")[2].split(" ")[1].split(":")[1]} ${parseInt(dailyDateAndTime.split("-")[2].split(" ")[1].split(":")[0]) >= 12 ? "PM" : "AM"}`}</div> :
                      <div className='font-medium text-lg leading-[1.25]'>Loading...</div>
                  }
                </div>
                <div className='bg-white h-full flex flex-col items-center justify-center rounded-lg'>
                  <div className='text-[70px] leading-[1]'>{dailyRI ? dailyRI : "--"}</div>
                  {/* <div className='text-[70px] leading-[1]'>80</div> */}
                  <div className='font-medium text-xl'>Robots Installed</div>
                </div>
              </div>
              <div className='w-full h-full bg-white rounded-lg flex flex-col items-center justify-center py-2'>
                {
                  <CircularProgressbarWithChildren
                    className='size-[200px] mt-10'
                    circleRatio={0.55}
                    value={dailyWR || dailyRI ? dailyWR / dailyRI * 100 : 0}
                    // value={95}
                    // text={`${dailyWR || dailyRI ? dailyWR / dailyRI * 100 : 0}%`}
                    text={`${dailyWR ? dailyWR : 0}`}
                    // text={76}
                    styles={{
                      path: {
                        strokeLinecap: 'round',
                        transition: 'stroke-dashoffset 0.5s ease 0s',
                        transform: 'rotate(-99deg)',
                        transformOrigin: 'center center',
                        stroke: 'rgb(0,255,0)'
                      },
                      trail: {
                        strokeLinecap: 'round',
                        transition: 'stroke-dashoffset 0.5s ease 0s',
                        transform: 'rotate(-99deg)',
                        transformOrigin: 'center center',
                      },
                      text: {
                        fill: 'rgb(0,0,0)',
                        fontSize: '35px',
                      }
                    }}
                    strokeWidth={7}
                  >
                    <div className='font-medium' style={{ fontSize: 20, marginTop: 60 }}>Working Robots</div>
                  </CircularProgressbarWithChildren>
                }
              </div>
              <div className='w-full h-full bg-white rounded-lg flex flex-col items-center justify-center py-2'>
                <>
                  <CircularProgressbarWithChildren
                    className='size-[200px] mt-10'
                    circleRatio={0.55}
                    value={dailyNE || dailyOE || dailyRI ? (((dailyNE.length) ? dailyNE.split(",").length : 0) + ((dailyOE.length) ? dailyOE.split(",").length : 0)) / dailyRI * 100 : 0}
                    // value={5}
                    // text={`${dailyNE || dailyOE || dailyRI ? (((dailyNE.length) ? dailyNE.split(",").length : 0) + ((dailyOE.length) ? dailyOE.split(",").length : 0)) / dailyRI * 100 : 0}%`}
                    text={`${dailyNE || dailyOE ? (((dailyNE.length) ? dailyNE.split(",").length : 0) + ((dailyOE.length) ? dailyOE.split(",").length : 0)) : 0}`}
                    // text= "4"
                    styles={{
                      path: {
                        strokeLinecap: 'round',
                        transition: 'stroke-dashoffset 0.5s ease 0s',
                        transform: 'rotate(-99deg)',
                        transformOrigin: 'center center',
                        stroke: 'rgb(255,0,0)'
                      },
                      trail: {
                        strokeLinecap: 'round',
                        transition: 'stroke-dashoffset 0.5s ease 0s',
                        transform: 'rotate(-99deg)',
                        transformOrigin: 'center center',
                      },
                      text: {
                        fill: 'rgb(0,0,0)',
                        fontSize: '35px',
                      }
                    }}
                    strokeWidth={7}
                  >
                    <div className='font-medium' style={{ fontSize: 20, marginTop: 60 }}>Erroneous Robots</div>
                  </CircularProgressbarWithChildren>
                </>

              </div>
              <div className='w-full h-full bg-white rounded-lg p-1'>
                <div className='font-medium text-xl px-3 py-1 rounded-lg text-center mx-1 '>Network Error</div>
                <div className='rounded-lg h-[75%] flex flex-col gap-2 overflow-y-auto'>
                  {
                    typeof (dailyOE) === 'string' ?
                      Object.values(dailyNE.split(',').sort()).map(NEVal => (
                        (NEVal) ?
                          <div className='text-center bg-[#cfcfcf] mx-1 py-1 rounded-lg'>{`Robot ${NEVal}`}</div> :
                          <div className='flex justify-center items-center h-[75%]'><span>No Robots</span></div>
                      )) :
                      <div className='flex justify-center items-center h-[75%]'><span>Loading...</span></div>
                  }
                  {/* <div className='text-center bg-[#cfcfcf] mx-1 py-1 rounded-lg'>{`Robot 13`}</div>
                  <div className='text-center bg-[#cfcfcf] mx-1 py-1 rounded-lg'>{`Robot 52`}</div>
                  <div className='text-center bg-[#cfcfcf] mx-1 py-1 rounded-lg'>{`Robot 76`}</div> */}
                </div>
              </div>
              <div className='w-full h-full bg-white rounded-lg p-1'>
                <div className=' px-3 py-1 rounded-lg text-center mx-1 font-medium text-xl'>Other Error</div>
                <div className='rounded-lg h-[75%] flex flex-col gap-2 overflow-y-auto'>
                  {
                    typeof (dailyOE) === 'string' ?
                      Object.values(dailyOE.split(',').sort()).map(OEVal => (
                        (OEVal) ?
                          <div className='text-center bg-[#cfcfcf] mx-1 py-1 rounded-lg'>{`Robot ${OEVal}`}</div> :
                          <div className='flex justify-center items-center h-[75%]'><span>No Robots</span></div>
                      )) :
                      <div className='flex justify-center items-center h-[75%]'><span>Loading...</span></div>
                  }
                  {/* <div className='text-center bg-[#cfcfcf] mx-1 py-1 rounded-lg'>{`Robot 68`}</div> */}
                </div>
              </div>
            </div>
          ))
        }
      </div>

      <div className='third-div bg-[#cfcfcf] h-[55%] rounded-lg p-5 flex gap-7'>
        {(monthlyReport && monthlyReport === 0) ?

          <>
            <div className='flex h-full w-full items-center justify-center text-white'>
              <div className='bg-[rgb(255,0,0)] text-white border-[1px] shadow-[0_0px_20px_1px_rgba(0,0,0,0.29)] text-center px-3 py-1 ml-3 rounded-md text-2xl'>NOTE: The Monthly Report will be generated only if the Daily Report is not empty</div>
            </div>
          </> :

          <>
            <div className='h-full w-full'>
              <div className='h-fit px-2 pb-2'>
                <div className='text-[40px] leading-[1]'>Monthly Report</div>
                <div className='font-medium text-xl leading-[1.25]'>{`${months[month]} ${year}`}</div>
              </div>
              <div className='grid grid-cols-2 gap-7 h-[75%]'>
                <div className='h-full w-full bg-white flex flex-col items-center justify-center rounded-lg px-2'>
                  <div className='text-[70px] leading-[1]'>{(isNaN(WR) || isNaN(noOfDays) || WR === null || noOfDays === 0) ? '--' : Math.round(WR / noOfDays)}</div>
                  {/* <div className='text-[70px] leading-[1]'>{77}</div> */}
                  <div className='font-medium text-lg'>AVG. Working Robots</div>
                </div>
                <div className='h-full w-full bg-white flex flex-col items-center justify-center rounded-lg px-2'>
                  <div className='text-[70px] leading-[1]'>{(isNaN(NE) || isNaN(OE) || isNaN(noOfDays) || NE === null || noOfDays === 0) ? "--" : Math.round((NE + OE) / noOfDays)}</div>
                  {/* <div className='text-[70px] leading-[1]'>{3}</div> */}
                  <div className='font-medium text-lg'>AVG. Erroneous Robots</div>
                </div>
                <div className='h-full w-full bg-white flex flex-col items-center justify-center rounded-lg px-2'>
                  <div className='text-[70px] leading-[1]'>{(isNaN(NE) || isNaN(noOfDays) || NE === null || OE === null || noOfDays === 0) ? "--" :Math.round(NE / noOfDays)}</div>
                  {/* <div className='text-[70px] leading-[1]'>{2}</div> */}
                  <div className='font-medium text-lg'>AVG. Robots having Network Error</div>
                </div>
                <div className='h-full w-full bg-white flex flex-col items-center justify-center rounded-lg px-2'>
                  <div className='text-[70px] leading-[1]'>{(isNaN(OE) || isNaN(noOfDays) || OE === null || noOfDays === 0) ? "--" : OE / noOfDays}</div>
                  {/* <div className='text-[70px] leading-[1]'>{1}</div> */}
                  <div className='font-medium text-lg'>AVG. Robots having Other Errors</div>
                </div>
              </div>
            </div>
            <div className='bg-white h-full w-[60%] flex flex-col items-center justify-center py-2 rounded-lg'>
              {(WR === null || RI === null || noOfDays === 0) ?

                <div>Loading...</div> :

                <CircularProgressbarWithChildren
                  className='size-[300px] mt-10'
                  circleRatio={0.55}
                  // value={(isNaN(WR) || isNaN(RI) || isNaN(noOfDays)) ? 0 : ((WR / (noOfDays * RI)) * 100)}
                  value={overallEfficiency}
                  // text={`${(isNaN(WR) || isNaN(RI) || isNaN(noOfDays)) ? 0 : ((WR / (noOfDays * RI)) * 100)}%`}
                  text={`${overallEfficiency}%`}
                  styles={{
                    path: {
                      strokeLinecap: 'round',
                      transition: 'stroke-dashoffset 0.5s ease 0s',
                      transform: 'rotate(-99deg)',
                      transformOrigin: 'center center',
                      stroke: overallEfficiency < 30 ? 'rgb(255,0,0)' : overallEfficiency >= 30 && overallEfficiency < 70 ? '#fea920' : 'rgb(0,255,0)'
                    },
                    trail: {
                      strokeLinecap: 'round',
                      transition: 'stroke-dashoffset 0.5s ease 0s',
                      transform: 'rotate(-99deg)',
                      transformOrigin: 'center center',
                    },
                    text: {
                      fill: 'rgb(0,0,0)',
                      fontSize: '30px',
                    }
                  }}
                  strokeWidth={7}
                >
                  <div className='font-medium' style={{ fontSize: 34, marginTop: 100 }}>Overall Efficiency</div>
                </CircularProgressbarWithChildren>
              }
            </div>
          </>
        }
      </div>
    </div>
  );
};

export default DailyReport;