import React, { useState, useEffect, useRef } from 'react';
import { useLoaderData } from 'react-router-dom';
import { CircularProgressbarWithChildren } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { fetchPlantIDAndPlantNameFromFirestore } from '../../../auth.js';
import { utils, writeFile } from "xlsx"
import { months } from '../../Calender/calender.js';
import arrow from '../../../assets/right-arrow.png'

const DailyReport = () => {

  const route = `${import.meta.env.VITE_FLASK_API}`;

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
  const [dailyER, setDailyER] = useState(null);
  //monthly
  const [noOfDays, setNoOfDays] = useState(0);
  const [RI, setRI] = useState(null);
  const [WR, setWR] = useState(null);
  const [NE, setNE] = useState(null);
  const [OE, setOE] = useState(null);
  const [ER, setER] = useState(null);
  //click events
  const [reportClicked, setReportClicked] = useState(false)

  console.log(RI, WR, NE, OE, noOfDays)
  console.log("monthlyReport", monthlyReport)

  const setDataFromDailyReport = () => {

    console.log("insidesetDataFromDailyReport")

    let tempDailyRI = NaN;
    let tempDailyWR = NaN;
    let tempDailyNE = "";
    let tempDailyOE = "";
    let tempDailyER = "";
    let tempDailyDateAndTime = "";

    Object.keys(dailyReport).forEach((key) => {
      tempDailyDateAndTime = key;
    })

    Object.values(dailyReport).forEach((value) => {
      tempDailyRI = value.RI;
      tempDailyWR = value.WR;
      tempDailyNE = value.NE;
      tempDailyOE = value.OE;
      tempDailyER = value.ER;
    })

    return { tempDailyRI, tempDailyWR, tempDailyNE, tempDailyOE, tempDailyER, tempDailyDateAndTime }
  }

  const setDataFromMonthlyReport = () => {

    console.log("insidesetDataFromMonthlyReport")

    let tempRI = NaN;
    let tempWR = NaN;
    let tempNE = NaN;
    let tempOE = NaN;
    let tempER = NaN;
    let tempNoOfDays = NaN;

    const keys = Object.keys(monthlyReport);

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      if (parseInt(key.split(' ')[0].split('-')[1]) === new Date().getMonth() + 1) {
        const val = monthlyReport[key]
        if (!(JSON.stringify(val) === '{}' && val.constructor === Object)) {
          if (isNaN(tempRI) && isNaN(tempWR) && isNaN(tempNE) && isNaN(tempOE) && isNaN(tempNoOfDays)) {
            tempRI = tempWR = tempNE = tempOE = tempER = tempNoOfDays = 0;
          }
          console.log(val)
          tempRI = val.RI
          tempNE += ((val.NE) ? val.NE.split(",").length : 0)
          tempOE += ((val.OE) ? val.OE.split(",").length : 0)
          tempER += ((val.ER) ? val.ER.split(",").length : 0)
          tempWR += val.WR
          tempNoOfDays += 1;
        }
      }
      continue;
    }
    console.log("tempER", tempER)
    return { tempRI, tempWR, tempNE, tempOE, tempER, tempNoOfDays }
  }

  console.log("dailyDateandTime", dailyDateAndTime)

  const handleDownloadDailyReport = () => {

    const formattedDate = dailyDateAndTime.split(' ')[0].split('-')[2] + "-" + dailyDateAndTime.split(' ')[0].split('-')[1] + "-" + dailyDateAndTime.split(' ')[0].split('-')[0] + " " + dailyDateAndTime.split(' ')[1];

    const exportingArr = [{
      Date_and_Time: formattedDate,
      Robots_Installed: dailyRI,
      Working_Robots: dailyWR,
      Erroneous_Robots: dailyER ? dailyER.split(',').length : 0,
      Network_Error: dailyNE ? dailyNE.split(',').length : 0,
      Other_Error: dailyOE ? dailyOE.split(',').length : 0
    }]

    console.log(exportingArr);
    const ws = utils.json_to_sheet(exportingArr)
    const wb = utils.book_new()

    utils.book_append_sheet(wb, ws, "Sheet1");

    writeFile(wb, `Daily Report - ${formattedDate}.xlsx`)
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
          Erroneous_Robots: val.ER ? val.ER.split(',').length : 0,
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

  const handleReportClicked = () => {
    setReportClicked(!reportClicked)
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
      const { tempRI, tempWR, tempNE, tempOE, tempER, tempNoOfDays } = setDataFromMonthlyReport()
      setRI(tempRI);
      setWR(tempWR);
      setNE(tempNE);
      setOE(tempOE);
      setER(tempER);
      setNoOfDays(tempNoOfDays);
    }
  }, [monthlyReport])

  useEffect(() => {
    if (dailyReport && !Object.keys(dailyReport).includes('0')) {
      const { tempDailyRI, tempDailyWR, tempDailyNE, tempDailyOE, tempDailyER, tempDailyDateAndTime } = setDataFromDailyReport();
      setDailyRI(tempDailyRI);
      setDailyWR(tempDailyWR);
      setDailyNE(tempDailyNE);
      setDailyOE(tempDailyOE);
      setDailyER(tempDailyER);
      setDailyDateAndTime(tempDailyDateAndTime);
    }
  }, [dailyReport])

  useEffect(() => {
    console.log(dailyNE, dailyOE, dailyRI, dailyDateAndTime, dailyWR, dailyER)
  }, [dailyNE, dailyOE, dailyRI, dailyDateAndTime, dailyWR, dailyER])

  useEffect(() => {
    console.log(RI, WR, NE, OE, ER, noOfDays)
  }, [RI, WR, OE, NE, ER, noOfDays])

  useEffect(() => {
    console.log(monthlyReport)
  }, [monthlyReport])

  const currDate = new Date();
  const day = currDate.getDate();
  const month = currDate.getMonth();
  const year = currDate.getFullYear();
  const overallEfficiency = (isNaN(WR) || isNaN(RI) || isNaN(noOfDays)) ? 0 : Math.round((WR / (noOfDays * RI)) * 100)

  const downloadRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (downloadRef.current && !downloadRef.current.contains(event.target)) {
        setReportClicked(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [downloadRef]);

  return (
    <div>
      <div className=' w-[95%] mx-auto mt-4 max-[490px]:mt-3 mb-10 '>
        <div className='first-div flex justify-between items-end mx-5 mb-2 max-[590px]:mx-0 max-[590px]:ml-1 '>
          <div className='text-3xl max-[590px]:text-2xl max-[490px]:text-[20px]'>{(plantName === " ") ? "Loading..." : plantName}</div>
          {/* <div className='text-3xl'>{"Magnet, Punjab (50MW)"}</div> */}
          <div className='flex gap-2 items-center max-[775px]:hidden'>
            <div onClick={handleDownloadDailyReport} className='text-sm bg-[#fea920] py-1 px-3 rounded-lg cursor-pointer transition-all duration-300 font-semibold hover:bg-[#fed220]'>{`Download Daily Report`}</div>
            <div onClick={handleDownloadMonthlyReport} className='text-sm bg-[#fea920] py-1 px-3 rounded-lg cursor-pointer transition-all duration-300 font-semibold hover:bg-[#fed220]'>{`Download Monthly Report`}</div>
            {/* <div className='text-lg'>{`Welcome ${userName}`}</div> */}
          </div>
          <div ref={downloadRef} className='max-[775px]:block hidden relative text-center'>
            <div>
              <div onClick={handleReportClicked} className='text-lg bg-[#fea920] px-3 rounded-lg cursor-pointer transition-all duration-300 font-semibold flex gap-2 py-2 items-center max-[590px]:py-2'>
                <span className='max-[590px]:text-sm'>{`Download Report`}</span>
                <span className={`size-4 max-[590px]:size-3 ${reportClicked ? "rotate-[270deg]" : "rotate-90"} transition-all duration-150`}><img src={arrow}></img></span>
              </div>
              <div className={`${reportClicked ? "block" : "hidden"} absolute top-12 max-[490px]:top-10 rounded-lg z-10 bg-white px-2 py-1 w-full mx-auto shadow-[0_0px_20px_1px_rgba(0,0,0,0.29)] transition-all duration-300`}>
                <div onClick={handleDownloadDailyReport} className='text-lg py-2 border-b-[1px] border-[#0000005c] px-3 cursor-pointer transition-all duration-300 font-semibold max-[590px]:text-sm'>{`Daily Report`}</div>
                <div onClick={handleDownloadMonthlyReport} className='text-lg py-2 px-3  cursor-pointer transition-all duration-300 font-semibold max-[590px]:text-sm'>{`Monthly Report`}</div>
              </div>
            </div>
          </div>

        </div>

        <div className='second-div max-[1150px]:hidden bg-[#cfcfcf] h-[35%] rounded-lg mb-3'>
          {(dailyReport === 0) ?
            <>
              <div className='flex h-full items-center justify-center'>
                <div className='bg-[rgb(255,0,0)] text-white border-[1px] shadow-[0_0px_20px_1px_rgba(0,0,0,0.29)] text-center px-3 py-1 ml-3 rounded-md text-2xl'>NOTE: The Daily Report will be updated only after 2 hours of the scheduled time </div>
              </div></> :

            // Object.entries(dailyReport).map(([dateAndTime, val]) => (

            <div className='flex gap-4 justify-between p-5 h-full '>
              {/* <div className='flex gap-4 mb-4'> */}
              <div className=' w-full flex flex-col rounded-lg gap-2'>
                <div className='h-fit px-2'>
                  <div className='text-[40px] max-[1630px]:text-[35px] max-[1458px]:text-[30px] max-[1287px]:text-[27px] leading-[1.25]'>Daily Report</div>
                  {
                    (dailyDateAndTime) ?
                      <div className='font-semibold text-lg max-[1365px]:text-[15px] leading-[1.25]'>{`${dailyDateAndTime.split("-")[2].split(" ")[0]} ${months[dailyDateAndTime.split("-")[1].split("")[1] - 1]} ${"20" + dailyDateAndTime.split("-")[0]} - 
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
              <div className='w-full bg-white rounded-lg flex flex-col items-center justify-center'>
                {
                  <CircularProgressbarWithChildren
                    className='size-[180px] pt-6'
                    circleRatio={0.553}
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
                    <div className='font-medium' style={{ fontSize: 20, marginTop: 120 }}>Working Robots</div>
                  </CircularProgressbarWithChildren>
                }
              </div>
              <div className='w-full bg-white rounded-lg flex flex-col items-center justify-center'>
                <>
                  <CircularProgressbarWithChildren
                    className='size-[180px] pt-6'
                    circleRatio={0.553}
                    // value={dailyNE || dailyOE || dailyRI ? (((dailyNE.length) ? dailyNE.split(",").length : 0) + ((dailyOE.length) ? dailyOE.split(",").length : 0)) / dailyRI * 100 : 0}
                    value={dailyER || dailyRI ? (((dailyER.length) ? dailyER.split(",").length : 0)) / dailyRI * 100 : 0}
                    // value={5}
                    // text={`${dailyNE || dailyOE || dailyRI ? (((dailyNE.length) ? dailyNE.split(",").length : 0) + ((dailyOE.length) ? dailyOE.split(",").length : 0)) / dailyRI * 100 : 0}%`}
                    // text={`${dailyNE || dailyOE ? (((dailyNE.length) ? dailyNE.split(",").length : 0) + ((dailyOE.length) ? dailyOE.split(",").length : 0)) : 0}`}
                    text={`${dailyER ? (((dailyER.length) ? dailyER.split(",").length : 0)) : 0}`}
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
                    <div className='font-medium' style={{ fontSize: 19, marginTop: 120 }}>Erroneous Robots</div>
                  </CircularProgressbarWithChildren>
                </>
              </div>
              {/* </div> */}

              {/* <div className='flex gap-4'> */}
              <div className='w-full bg-white rounded-lg p-1'>
                <div className='font-medium text-xl px-3 py-1 rounded-lg text-center mx-1 '>Network Error</div>
                <div className='rounded-lg h-[75%] flex flex-col gap-2 overflow-y-auto'>
                  {
                    typeof (dailyOE) === 'string' ?
                      Object.values(dailyNE.split(',').sort((a, b) => (a).localeCompare(b, 'en', { numeric: true }))).map(NEVal => (
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
              <div className='w-full bg-white rounded-lg p-1'>
                <div className=' px-3 py-1 rounded-lg text-center mx-1 font-medium text-xl'>Other Error</div>
                <div className='rounded-lg h-[75%] flex flex-col gap-2 overflow-y-auto'>
                  {
                    typeof (dailyOE) === 'string' ?
                      Object.values(dailyOE.split(',').sort((a, b) => (a).localeCompare(b, 'en', { numeric: true }))).map(OEVal => (
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
            // </div>
            // ))
          }
        </div>

        <div className='second-div-ver2 hidden max-[1150px]:block max-[685px]:hidden  bg-[#cfcfcf] h-[35%] rounded-lg mb-3'>
          {(dailyReport === 0) ?
            <>
              <div className='flex h-full items-center justify-center'>
                <div className='bg-[rgb(255,0,0)] text-white border-[1px] shadow-[0_0px_20px_1px_rgba(0,0,0,0.29)] text-center px-3 py-1 ml-3 rounded-md text-2xl'>NOTE: The Daily Report will be updated only after 2 hours of the scheduled time </div>
              </div></> :

            // Object.entries(dailyReport).map(([dateAndTime, val]) => (

            <div className='flex-col gap-4 justify-between p-5 h-full '>
              <div className='flex gap-4 mb-4'>
                <div className=' w-full flex flex-col rounded-lg gap-2'>
                  <div className='h-fit px-2'>
                    <div className='dailyReport text-[40px] max-[1630px]:text-[35px] max-[1458px]:text-[30px] max-[1287px]:text-[27px] leading-[1.25]'>Daily Report</div>
                    {
                      (dailyDateAndTime) ?
                        <div className='font-semibold text-lg max-[1365px]:text-[15px] leading-[1.25]'>{`${dailyDateAndTime.split("-")[2].split(" ")[0]} ${months[dailyDateAndTime.split("-")[1].split("")[1] - 1]} ${"20" + dailyDateAndTime.split("-")[0]} - 
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
                <div className='w-full bg-white rounded-lg flex flex-col items-center justify-center'>
                  {
                    <CircularProgressbarWithChildren
                      className='size-[180px] pt-6'
                      circleRatio={0.553}
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
                      <div className='font-medium' style={{ fontSize: 20, marginTop: 120 }}>Working Robots</div>
                    </CircularProgressbarWithChildren>
                  }
                </div>
                <div className='w-full bg-white rounded-lg flex flex-col items-center justify-center'>
                  <>
                    <CircularProgressbarWithChildren
                      className='size-[180px] pt-6'
                      circleRatio={0.553}
                      // value={dailyNE || dailyOE || dailyRI ? (((dailyNE.length) ? dailyNE.split(",").length : 0) + ((dailyOE.length) ? dailyOE.split(",").length : 0)) / dailyRI * 100 : 0}
                      value={dailyER || dailyRI ? (((dailyER.length) ? dailyER.split(",").length : 0)) / dailyRI * 100 : 0}
                      // value={5}
                      // text={`${dailyNE || dailyOE || dailyRI ? (((dailyNE.length) ? dailyNE.split(",").length : 0) + ((dailyOE.length) ? dailyOE.split(",").length : 0)) / dailyRI * 100 : 0}%`}
                      // text={`${dailyNE || dailyOE ? (((dailyNE.length) ? dailyNE.split(",").length : 0) + ((dailyOE.length) ? dailyOE.split(",").length : 0)) : 0}`}
                      text={`${dailyER ? (((dailyER.length) ? dailyER.split(",").length : 0)) : 0}`}
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
                      <div className='font-medium' style={{ fontSize: 19, marginTop: 120 }}>Erroneous Robots</div>
                    </CircularProgressbarWithChildren>
                  </>
                </div>
              </div>

              <div className='flex gap-4'>
                <div className='w-full h-[200px] bg-white rounded-lg p-2 transition-all duration-300'>
                  <div className='font-medium text-xl px-3 py-1 rounded-lg text-center mx-1 '>Network Error</div>
                  <div className='rounded-lg h-[77%] flex flex-col gap-2 overflow-y-auto'>
                    {
                      typeof (dailyOE) === 'string' ?
                        Object.values(dailyNE.split(',').sort((a, b) => (a).localeCompare(b, 'en', { numeric: true }))).map(NEVal => (
                          (NEVal) ?
                            <div className='text-center bg-[#cfcfcf] mx-1 py-1 rounded-lg'>{`Robot ${NEVal}`}</div> :
                            <div className='flex justify-center items-center h-[75%]'><span>No Robots</span></div>
                        )) :
                        <div className='flex justify-center items-center h-[75%]'><span>Loading...</span></div>
                    }
                    {/* <div className='text-center bg-[#cfcfcf] mx-1 py-1 rounded-lg'>{`Robot 13`}</div>
                  <div className='text-center bg-[#cfcfcf] mx-1 py-1 rounded-lg'>{`Robot 52`}</div>
                  <div className='text-center bg-[#cfcfcf] mx-1 py-1 rounded-lg'>{`Robot 76`}</div>
                  <div className='text-center bg-[#cfcfcf] mx-1 py-1 rounded-lg'>{`Robot 76`}</div>
                  <div className='text-center bg-[#cfcfcf] mx-1 py-1 rounded-lg'>{`Robot 76`}</div>
                  <div className='text-center bg-[#cfcfcf] mx-1 py-1 rounded-lg'>{`Robot 76`}</div>
                  <div className='text-center bg-[#cfcfcf] mx-1 py-1 rounded-lg'>{`Robot 76`}</div>
                  <div className='text-center bg-[#cfcfcf] mx-1 py-1 rounded-lg'>{`Robot 76`}</div> */}
                  </div>
                </div>
                <div className='w-full h-[200px] bg-white rounded-lg p-2 transition-all duration-300'>
                  <div className=' px-3 py-1 rounded-lg text-center mx-1 font-medium text-xl'>Other Error</div>
                  <div className='rounded-lg h-[77%] flex flex-col gap-2 overflow-y-auto'>
                    {
                      typeof (dailyOE) === 'string' ?
                        Object.values(dailyOE.split(',').sort((a, b) => (a).localeCompare(b, 'en', { numeric: true }))).map(OEVal => (
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
            </div>
            // ))
          }
        </div>

        <div className='second-div-ver3 hidden max-[685px]:block bg-[#cfcfcf] h-[35%] rounded-lg mb-3'>
          {(dailyReport === 0) ?
            <>
              <div className='flex h-full items-center justify-center'>
                <div className='bg-[rgb(255,0,0)] text-white border-[1px] shadow-[0_0px_20px_1px_rgba(0,0,0,0.29)] text-center px-3 py-1 ml-3 rounded-md text-2xl'>NOTE: The Daily Report will be updated only after 2 hours of the scheduled time </div>
              </div></> :

            // Object.entries(dailyReport).map(([dateAndTime, val]) => (

            <div className='flex-col gap-4 justify-between p-5 max-[490px]:p-3 h-full '>
              {/* <div className='flex gap-4 mb-4'> */}
              <div className=' w-full flex flex-col rounded-lg gap-2'>
                <div className='flex justify-between mb-4 max-[490px]:mb-3'>
                  <div className='h-fit px-2 max-[490px]:px-0'>
                    <div className='dailyReport text-[40px] max-[1630px]:text-[35px] max-[1458px]:text-[30px] max-[1287px]:text-[27px] max-[490px]:text-[20px] leading-[1.25]'>Daily Report</div>
                    {
                      (dailyDateAndTime) ?
                        <div className='font-semibold text-lg max-[1365px]:text-[15px] max-[490px]:text-[14px] leading-[1.25]'>{`${dailyDateAndTime.split("-")[2].split(" ")[0]} ${months[dailyDateAndTime.split("-")[1].split("")[1] - 1]} ${"20" + dailyDateAndTime.split("-")[0]} - 
                           ${parseInt(dailyDateAndTime.split("-")[2].split(" ")[1].split(":")[0]) > 12 ? parseInt(dailyDateAndTime.split("-")[2].split(" ")[1].split(":")[0]) - 12 : dailyDateAndTime.split("-")[2].split(" ")[1].split(":")[0]}:${dailyDateAndTime.split("-")[2].split(" ")[1].split(":")[1]} ${parseInt(dailyDateAndTime.split("-")[2].split(" ")[1].split(":")[0]) >= 12 ? "PM" : "AM"}`}</div> :
                        <div className='font-medium text-lg max-[1365px]:text-[15px] max-[490px]:text-[14px] leading-[1.25]'>Loading...</div>
                    }
                  </div>
                  <div className='bg-white px-2 flex gap-2 items-center justify-center rounded-lg'>
                    <div className='font-semibold text-2xl max-[590px]:text-[18px] max-[490px]:text-[14px]'>Robots Installed:</div>
                    <div className='text-2xl max-[590px]:text-[20px] max-[490px]:text-[18px]'>{dailyRI ? dailyRI : "--"}</div>
                    {/* <div className='text-2xl max-[590px]:text-[20px] max-[490px]:text-[18px]'>100</div> */}
                  </div>
                </div>
              </div>

              <div className='flex mb-4 max-[490px]:mb-3 gap-4 max-[490px]:gap-3'>
                <div className='w-full bg-white rounded-lg flex flex-col items-center justify-center'>
                  {
                    <CircularProgressbarWithChildren
                      className='size-[180px] pt-6 max-[490px]:size-[160px]'
                      circleRatio={0.553}
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
                      <div className='font-medium max-[490px]:hidden' style={{ fontSize: 20, marginTop: 120 }}>Working Robots</div>
                      <div className='font-medium hidden max-[490px]:block' style={{ fontSize: 16, marginTop: 120 }}>Working Robots</div>
                    </CircularProgressbarWithChildren>
                  }
                </div>
                <div className='w-full bg-white rounded-lg flex flex-col items-center justify-center'>
                  <>
                    <CircularProgressbarWithChildren
                      className='size-[180px] pt-6 max-[490px]:size-[160px]'
                      circleRatio={0.553}
                      // value={dailyNE || dailyOE || dailyRI ? (((dailyNE.length) ? dailyNE.split(",").length : 0) + ((dailyOE.length) ? dailyOE.split(",").length : 0)) / dailyRI * 100 : 0}
                      value={dailyER || dailyRI ? (((dailyER.length) ? dailyER.split(",").length : 0)) / dailyRI * 100 : 0}
                      // value={5}
                      // text={`${dailyNE || dailyOE || dailyRI ? (((dailyNE.length) ? dailyNE.split(",").length : 0) + ((dailyOE.length) ? dailyOE.split(",").length : 0)) / dailyRI * 100 : 0}%`}
                      // text={`${dailyNE || dailyOE ? (((dailyNE.length) ? dailyNE.split(",").length : 0) + ((dailyOE.length) ? dailyOE.split(",").length : 0)) : 0}`}
                      text={`${dailyER ? (((dailyER.length) ? dailyER.split(",").length : 0)) : 0}`}
                      // text= "40"
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
                      <div className='font-medium max-[490px]:hidden' style={{ fontSize: 19, marginTop: 120 }}>Erroneous Robots</div>
                      <div className='font-medium hidden max-[490px]:block' style={{ fontSize: 16, marginTop: 120 }}>Erroneous Robots</div>
                    </CircularProgressbarWithChildren>
                  </>
                </div>
              </div>

              <div className='flex gap-4 max-[490px]:gap-3'>
                <div className='w-full h-[200px] bg-white rounded-lg p-1 transition-all duration-300'>
                  <div className='font-medium text-xl px-3 py-1 rounded-lg text-center mx-1 max-[490px]:text-[16px]'>Network Error</div>
                  <div className='rounded-lg h-[78%] flex flex-col gap-2 overflow-y-auto'>
                    {
                      typeof (dailyOE) === 'string' ?
                        Object.values(dailyNE.split(',').sort((a, b) => (a).localeCompare(b, 'en', { numeric: true }))).map(NEVal => (
                          (NEVal) ?
                            <div className='text-center bg-[#cfcfcf] mx-1 py-1 rounded-lg max-[490px]:text-[14px]'>{`Robot ${NEVal}`}</div> :
                            <div className='flex justify-center items-center h-[75%]'><span>No Robots</span></div>
                        )) :
                        <div className='flex justify-center items-center h-[75%]'><span>Loading...</span></div>
                    }
                    {/* <div className='text-center bg-[#cfcfcf] mx-1 py-1 rounded-lg'>{`Robot 13`}</div>
                  <div className='text-center bg-[#cfcfcf] mx-1 py-1 rounded-lg'>{`Robot 52`}</div>
                  <div className='text-center bg-[#cfcfcf] mx-1 py-1 rounded-lg'>{`Robot 76`}</div>
                  <div className='text-center bg-[#cfcfcf] mx-1 py-1 rounded-lg'>{`Robot 76`}</div>
                  <div className='text-center bg-[#cfcfcf] mx-1 py-1 rounded-lg'>{`Robot 76`}</div>
                  <div className='text-center bg-[#cfcfcf] mx-1 py-1 rounded-lg'>{`Robot 76`}</div>
                  <div className='text-center bg-[#cfcfcf] mx-1 py-1 rounded-lg'>{`Robot 76`}</div>
                  <div className='text-center bg-[#cfcfcf] mx-1 py-1 rounded-lg'>{`Robot 76`}</div> */}
                  </div>
                </div>
                <div className='w-full h-[200px] bg-white rounded-lg p-1 transition-all duration-300'>
                  <div className=' px-3 py-1 rounded-lg text-center mx-1 font-medium text-xl max-[490px]:text-[16px]'>Other Error</div>
                  <div className='rounded-lg h-[78%] flex flex-col gap-2 overflow-y-auto'>
                    {
                      typeof (dailyOE) === 'string' ?
                        Object.values(dailyOE.split(',').sort((a, b) => (a).localeCompare(b, 'en', { numeric: true }))).map(OEVal => (
                          (OEVal) ?
                            <div className='text-center bg-[#cfcfcf] mx-1 py-1 rounded-lg max-[490px]:text-[14px]'>{`Robot ${OEVal}`}</div> :
                            <div className='flex justify-center items-center h-[75%]'><span>No Robots</span></div>
                        )) :
                        <div className='flex justify-center items-center h-[75%]'><span>Loading...</span></div>
                    }
                    {/* <div className='text-center bg-[#cfcfcf] mx-1 py-1 rounded-lg'>{`Robot 68`}</div> */}
                  </div>
                </div>
              </div>
            </div>
            // ))
          }
        </div>

        <div className='third-div max-[1150px]:hidden bg-[#cfcfcf] rounded-lg p-5 flex gap-7'>
          {(monthlyReport & monthlyReport === 0) ?

            <>
              <div className='flex h-full w-full items-center justify-center text-white'>
                <div className='bg-[rgb(255,0,0)] text-white border-[1px] shadow-[0_0px_20px_1px_rgba(0,0,0,0.29)] text-center px-3 py-1 ml-3 rounded-md text-2xl'>NOTE: The Monthly Report will be generated only if the Daily Report is not empty</div>
              </div>
            </> :

            <>
              <div className='justify-between w-full flex flex-col'>
                <div className=' px-2 pb-2'>
                  <div className='text-[40px] max-[1630px]:text-[35px] max-[1458px]:text-[30px] max-[1287px]:text-[27px] leading-[1.25]'>Monthly Report</div>
                  <div className='font-semibold text-xl leading-[1.25]'>{`${months[month]} ${year}`}</div>
                </div>
                <div className='grid grid-cols-2 h-[250px] gap-4'>
                  <div className=' w-full bg-white flex flex-col items-center justify-center rounded-lg px-2'>
                    <div className='text-[70px] leading-[1]'>{(isNaN(WR) || isNaN(noOfDays) || WR === null || noOfDays === 0) ? '--' : Math.round(WR / noOfDays)}</div>
                    {/* <div className='text-[70px] leading-[1]'>{77}</div> */}
                    <div className='font-medium text-lg'>AVG. Working Robots</div>
                  </div>
                  <div className=' w-full bg-white flex flex-col items-center justify-center rounded-lg px-2'>
                    <div className='text-[70px] leading-[1]'>{(isNaN(ER) || isNaN(noOfDays) || ER === null || noOfDays === 0) ? "--" : Math.round((ER) / noOfDays)}</div>
                    {/* <div className='text-[70px] leading-[1]'>{3}</div> */}
                    <div className='font-medium text-lg'>AVG. Erroneous Robots</div>
                  </div>
                  <div className=' w-full bg-white flex flex-col items-center justify-center rounded-lg px-2'>
                    <div className='text-[70px] leading-[1]'>{(isNaN(NE) || isNaN(noOfDays) || NE === null || OE === null || noOfDays === 0) ? "--" : Math.round(NE / noOfDays)}</div>
                    {/* <div className='text-[70px] leading-[1]'>{2}</div> */}
                    <div className='font-medium text-lg'>AVG. Robots having Network Error</div>
                  </div>
                  <div className=' w-full bg-white flex flex-col items-center justify-center rounded-lg px-2'>
                    <div className='text-[70px] leading-[1]'>{(isNaN(OE) || isNaN(noOfDays) || OE === null || noOfDays === 0) ? "--" : Math.round(OE / noOfDays)}</div>
                    {/* <div className='text-[70px] leading-[1]'>{1}</div> */}
                    <div className='font-medium text-lg'>AVG. Robots having Other Errors</div>
                  </div>
                </div>
              </div>
              <div className='bg-white w-[40%] rounded-lg flex justify-center py-2 '>
                {(WR === null || RI === null || noOfDays === 0) ?

                  <div>Loading...</div> :

                  // <> <div className='text-center'>Overall Efficeincy</div>

                  <div className='flex justify-center'>
                    <CircularProgressbarWithChildren
                      className='mt-10 size-[250px]'
                      circleRatio={0.553}
                      // value={(isNaN(WR) || isNaN(RI) || isNaN(noOfDays)) ? 0 : ((WR / (noOfDays * RI)) * 100)}
                      value={overallEfficiency}
                      // text={`${(isNaN(WR) || isNaN(RI) || isNaN(noOfDays)) ? 0 : ((WR / (noOfDays * RI)) * 100)}%`}
                      text={`${overallEfficiency}%`}
                      // text={`100%`}
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
                          fontSize: '28px',
                        }
                      }}
                      strokeWidth={7}
                    >
                      <div className='font-medium' style={{ fontSize: 28, marginTop: 70 }}>Overall Efficiency</div>
                    </CircularProgressbarWithChildren>
                  </div>
                  // </>
                }
              </div>
            </>
          }
        </div>

        <div className='third-div-ver2 hidden max-[1150px]:block max-[685px]:hidden bg-[#cfcfcf] rounded-lg p-5'>
          <div className='flex gap-4'>
            {(monthlyReport & monthlyReport === 0) ?

              <>
                <div className='flex h-full w-full items-center justify-center text-white'>
                  <div className='bg-[rgb(255,0,0)] text-white border-[1px] shadow-[0_0px_20px_1px_rgba(0,0,0,0.29)] text-center px-3 py-1 ml-3 rounded-md text-2xl'>NOTE: The Monthly Report will be generated only if the Daily Report is not empty</div>
                </div>
              </> :

              <>
                <div className='justify-between w-full flex flex-col'>
                  <div className=' px-2 pb-2'>
                    <div className='text-[40px] max-[1630px]:text-[35px] max-[1458px]:text-[30px] max-[1287px]:text-[27px] leading-[1.25]'>Monthly Report</div>
                    <div className='font-semibold text-xl leading-[1.25]'>{`${months[month]} ${year}`}</div>
                  </div>
                  <div className='grid grid-cols-2 text-center gap-4'>
                    <div className=' w-full bg-white flex flex-col items-center justify-center py-2 rounded-lg px-2'>
                      <div className='text-[70px] max-[850px]:text-[60px] leading-[1]'>{(isNaN(WR) || isNaN(noOfDays) || WR === null || noOfDays === 0) ? '--' : Math.round(WR / noOfDays)}</div>
                      {/* <div className='text-[70px] leading-[1]'>{77}</div> */}
                      <div className='font-medium text-lg max-[850px]:text-[15px] leading-[1.25]'>AVG. Working Robots</div>
                    </div>
                    <div className=' w-full bg-white flex flex-col items-center justify-center py-2 rounded-lg px-2'>
                      <div className='text-[70px] max-[850px]:text-[60px] leading-[1]'>{(isNaN(ER) || isNaN(noOfDays) || ER === null || noOfDays === 0) ? "--" : Math.round((ER) / noOfDays)}</div>
                      {/* <div className='text-[70px] leading-[1]'>{3}</div> */}
                      <div className='font-medium text-lg max-[850px]:text-[15px] leading-[1.25]'>AVG. Erroneous Robots</div>
                    </div>
                    <div className=' w-full bg-white flex flex-col items-center justify-center py-2 rounded-lg px-2'>
                      <div className='text-[70px] max-[850px]:text-[60px] leading-[1]'>{(isNaN(NE) || isNaN(noOfDays) || NE === null || OE === null || noOfDays === 0) ? "--" : Math.round(NE / noOfDays)}</div>
                      {/* <div className='text-[70px] leading-[1]'>{2}</div> */}
                      <div className='font-medium text-lg max-[850px]:text-[15px] leading-[1.25]'>AVG. Robots having Network Error</div>
                    </div>
                    <div className=' w-full bg-white flex flex-col items-center justify-center rounded-lg px-2'>
                      <div className='text-[70px] max-[850px]:text-[60px] leading-[1]'>{(isNaN(OE) || isNaN(noOfDays) || OE === null || noOfDays === 0) ? "--" : Math.round(OE / noOfDays)}</div>
                      {/* <div className='text-[70px] leading-[1]'>{1}</div> */}
                      <div className='font-medium text-lg max-[850px]:text-[15px] leading-[1.25]'>AVG. Robots having Other Errors</div>
                    </div>
                  </div>
                </div>
                <div className='bg-white w-[70%] rounded-lg flex justify-center py-2 '>
                  {(WR === null || RI === null || noOfDays === 0) ?

                    <div>Loading...</div> :

                    // <> <div className='text-center'>Overall Efficeincy</div>

                    <div className='flex justify-center'>
                      <CircularProgressbarWithChildren
                        className='mt-10 size-[250px] max-[850px]:size-[220px] max-[790px]:size-[200px] max-[775px]:mt-16'
                        circleRatio={0.553}
                        // value={(isNaN(WR) || isNaN(RI) || isNaN(noOfDays)) ? 0 : ((WR / (noOfDays * RI)) * 100)}
                        value={overallEfficiency}
                        // text={`${(isNaN(WR) || isNaN(RI) || isNaN(noOfDays)) ? 0 : ((WR / (noOfDays * RI)) * 100)}%`}
                        text={`${overallEfficiency}%`}
                        // text={`100%`}
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
                            fontSize: '28px',
                          }
                        }}
                        strokeWidth={7}
                      >
                        <div className='font-medium max-[850px]:hidden' style={{ fontSize: 28, marginTop: 70 }}>Overall Efficiency</div>
                        <div className='font-medium hidden max-[850px]:block max-[790px]:hidden ' style={{ fontSize: 22, marginTop: 70 }}>Overall Efficiency</div>
                        <div className='font-medium hidden max-[790px]:block max-[775px]:hidden ' style={{ fontSize: 22, marginTop: 40 }}>Overall Efficiency</div>
                        <div className='font-medium hidden max-[775px]:block ' style={{ fontSize: 22, marginTop: 20 }}>Overall Efficiency</div>
                      </CircularProgressbarWithChildren>
                    </div>
                    // </>
                  }
                </div>
              </>
            }
          </div>
        </div>

        <div className='third-div-ver3 hidden max-[685px]:block bg-[#cfcfcf] rounded-lg p-5 pt-3 max-[490px]:p-3'>
          <div className='flex flex-col gap-4'>
            {(monthlyReport & monthlyReport === 0) ?

              <>
                <div className='flex h-full w-full items-center justify-center text-white'>
                  <div className='bg-[rgb(255,0,0)] text-white border-[1px] shadow-[0_0px_20px_1px_rgba(0,0,0,0.29)] text-center px-3 py-1 ml-3 rounded-md text-2xl'>NOTE: The Monthly Report will be generated only if the Daily Report is not empty</div>
                </div>
              </> :

              <>
                <div className='justify-between w-full flex flex-col'>
                  <div className='flex items-center justify-center gap-2 px-2 pb-2'>
                    <div className='text-[40px] max-[1630px]:text-[35px] max-[1458px]:text-[30px] max-[1287px]:text-[27px] max-[490px]:text-[23px] max-[450px]:text-[20px] leading-[1.25]'>Monthly Report</div>
                    <div className='font-semibold text-[27px] max-[490px]:text-[23px] max-[450px]:text-[20px] leading-[1.25]'>{`(${months[month].split('')[0] + months[month].split('')[1] + months[month].split('')[2]} ${year})`}</div>
                  </div>
                  <div className='grid grid-cols-2 text-center gap-4 max-[490px]:gap-3'>
                    <div className=' w-full bg-white flex flex-col items-center justify-center py-2 rounded-lg px-2'>
                      <div className='text-[70px] max-[850px]:text-[60px] leading-[1]'>{(isNaN(WR) || isNaN(noOfDays) || WR === null || noOfDays === 0) ? '--' : Math.round(WR / noOfDays)}</div>
                      {/* <div className='text-[70px] leading-[1]'>{77}</div> */}
                      <div className='font-medium text-lg max-[850px]:text-[15px] leading-[1.25]'>AVG. Working Robots</div>
                    </div>
                    <div className=' w-full bg-white flex flex-col items-center justify-center py-2 rounded-lg px-2'>
                      <div className='text-[70px] max-[850px]:text-[60px] leading-[1]'>{(isNaN(ER) || isNaN(noOfDays) || ER === null || noOfDays === 0) ? "--" : Math.round((ER) / noOfDays)}</div>
                      {/* <div className='text-[70px] leading-[1]'>{3}</div> */}
                      <div className='font-medium text-lg max-[850px]:text-[15px] leading-[1.25]'>AVG. Erroneous Robots</div>
                    </div>
                    <div className=' w-full bg-white flex flex-col items-center justify-center py-2 rounded-lg px-2'>
                      <div className='text-[70px] max-[850px]:text-[60px] leading-[1]'>{(isNaN(NE) || isNaN(noOfDays) || NE === null || OE === null || noOfDays === 0) ? "--" : Math.round(NE / noOfDays)}</div>
                      {/* <div className='text-[70px] leading-[1]'>{2}</div> */}
                      <div className='font-medium text-lg max-[850px]:text-[15px] leading-[1.25]'>AVG. Robots having Network Error</div>
                    </div>
                    <div className=' w-full bg-white flex flex-col items-center justify-center rounded-lg px-2'>
                      <div className='text-[70px] max-[850px]:text-[60px] leading-[1]'>{(isNaN(OE) || isNaN(noOfDays) || OE === null || noOfDays === 0) ? "--" : Math.round(OE / noOfDays)}</div>
                      {/* <div className='text-[70px] leading-[1]'>{1}</div> */}
                      <div className='font-medium text-lg max-[850px]:text-[15px] leading-[1.25]'>AVG. Robots having Other Errors</div>
                    </div>
                  </div>
                </div>
                <div className='bg-white full rounded-lg flex justify-center'>
                  {(WR === null || RI === null || noOfDays === 0) ?

                    <div>Loading...</div> :

                    // <> <div className='text-center'>Overall Efficeincy</div>

                    <div className='flex justify-center'>
                      <CircularProgressbarWithChildren
                        className='mt-10 size-[250px] max-[490px]:size-[220px] max-[490px]:mt-6'
                        circleRatio={0.553}
                        // value={(isNaN(WR) || isNaN(RI) || isNaN(noOfDays)) ? 0 : ((WR / (noOfDays * RI)) * 100)}
                        value={overallEfficiency}
                        // text={`${(isNaN(WR) || isNaN(RI) || isNaN(noOfDays)) ? 0 : ((WR / (noOfDays * RI)) * 100)}%`}
                        text={`${overallEfficiency}%`}
                        // text={`100%`}
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
                            fontSize: '28px',
                          }
                        }}
                        strokeWidth={7}
                      >
                        <div className='font-medium max-[490px]:hidden' style={{ fontSize: 28, marginTop: 70 }}>Overall Efficiency</div>
                        <div className='font-medium hidden max-[490px]:block' style={{ fontSize: 25, marginTop: 100 }}>Overall Efficiency</div>
                      </CircularProgressbarWithChildren>
                    </div>
                    // </>
                  }
                </div>
              </>
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyReport;