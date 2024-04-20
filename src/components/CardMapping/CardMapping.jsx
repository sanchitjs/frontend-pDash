import React from 'react'
import BlinkingText from '../BlinkingText/BlinkingText'
import battery from '../../assets/battery.png'
import timer from '../../assets/stop-watch-stroke-rounded.svg'
import arrow from '../../assets/next.png'

const CardMapping = ({allRobotData,robotStatus,robotError,ONStatus,displayError,networkError}) => {
  return (
    Object.entries(allRobotData).map(([robotID, robotData]) => (

        ((!robotStatus[robotID])) ?
          <>
            <div
              className={`cards bg-[#cfcfcf] w-[100%] flex transition-colors duration-300 ${!displayError[robotID] ? 'py-3' : 'pb-0 pt-3'} justify-between items-center rounded-lg  max-[550px]:px-2 max-[550px]:py-2`}
            >
              <div className='flex-col w-full '>
                <div className='flex justify-between items-center rounded-lg px-4 max-[550px]:px-1'>
                  <div>
                    <div className='text-xl max-[400px]:text-[17px]'>{`Robot ${parseInt(robotID.slice(1))}`}</div>
                    <div className='flex gap-1 min-[768px]:hidden'>
                      <div className='flex items-center gap-2'>
                        <img src={battery} className='size-5 max-[550px]:size-4' />
                        <div className='text-lg max-[550px]:text-sm transition-all duration-300'>
                          {(((robotData.BV - 21) / (29.2 - 21)) * 100).toFixed(2) + '%'}
                        </div>
                      </div>
                      <div className='font-medium '>|</div>
                      <div className='flex items-center gap-2'>
                        <img src={timer} className='size-6 max-[550px]:size-4' />
                        <div className='text-lg max-[550px]:text-sm flex mt-[1px] items-center transition-all duration-300'>
                          {`${Math.floor(robotData.OT / 60)}`}
                          <span className='text-lg max-[550px]:text-sm'>mins</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='flex items-center'>
                    <div className='flex gap-4 max-[768px]:hidden'>
                      <div className='flex flex-col items-end'>
                        <div className='text-sm font-semibold'>Battery Voltage</div>
                        <div className='text-3xl transition-all duration-300'>
                          {(((robotData.BV - 21) / (29.2 - 21)) * 100).toFixed(2) + '%'}
                        </div>
                      </div>
                      <div className='flex flex-col items-end'>
                        <div className='text-sm font-semibold'>Operated Time</div>
                        <div className='text-3xl'>
                          {`${Math.floor(robotData.OT / 60)}`}
                          <span className='text-[25px]'>mins</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      {(robotError[robotID]) ?
                        // <div onMouseEnter={() => { setDisplayError(prev => ({ ...prev, [robotID]: 1 })) }} onMouseLeave={() => { setDisplayError(prev => ({ ...prev, [robotID]: 0 })) }} className='bg-[rgb(255,0,0)] text-white border-[1px] shadow-[0_0px_20px_1px_rgba(0,0,0,0.29)] cursor-pointer px-4 py-1 ml-3 flex items-center gap-2 rounded-md text-2xl w-fit min-h-[60%]'>
                        <div onClick={() => { setDisplayError(prev => ({ ...prev, [robotID]: !prev[robotID] })) }} className='bg-[rgb(255,0,0)] text-white border-[1px] shadow-[0_0px_20px_1px_rgba(0,0,0,0.29)] cursor-pointer px-4 py-1 max-[550px]:px-2 max-[550px]:py-3 max-[550px]:gap-1 ml-3 flex items-center gap-2 rounded-md text-2xl w-fit min-h-[60%]'>
                          <span className='max-[550px]:text-sm'>Errors</span>
                          <span className={`invert size-6 max-[550px]:size-4 ${displayError[robotID] ? "rotate-[270deg]" : "rotate-90"} transition-all duration-300`}><img src={arrow}></img></span>
                        </div> :
                        <div></div>
                      }
                    </div>
                    {
                      (ONStatus[robotID] == 'connecting') ?
                        <>
                          <div className={`text-xl flex items-center ml-3`}>
                            <svg className="animate-spin -ml-1 mr-1 h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span className='max-[768px]:hidden'>Connecting...</span>
                          </div>
                        </> :
                        (ONStatus[robotID] === 'null') ?
                          <div className='flex gap-4 items-center'>
                            <div onClick={() => handleONChange(robotID)} className={`cursor-pointer bg-[#ffffff] shadow-[0_0px_20px_1px_rgba(0,0,0,0.29)] ml-3  px-4 py-1 rounded-md hover:bg-black hover:text-white hover:transition-all hover:duration-300 text-2xl max-[550px]:px-3 max-[550px]:text-[18px] max-[550px]:py-[7px]`}>ON</div>
                          </div> :

                          (ONStatus[robotID] === 'disable') ?
                            <div className='flex gap-4 items-center'>
                              <div className="cursor-not-allowed bg-[#ffffff] shadow-[0_0px_20px_1px_rgba(0,0,0,0.29)] ml-3  px-4 py-1 rounded-md text-2xl max-[550px]:text-[18px] max-[550px]:py-[7px]">ON</div>
                            </div> : <div></div>
                    }
                  </div>
                </div>
                <div className={`flex justify-around rounded-md gap-3 relative transition-all duration-300 ${!displayError[robotID] ? 'opacity-0 h-0' : 'opacity-1 mt-2 h-fit'}`}>
                  {/* <div className='absolute top-[-10px] rotate-45 right-10 size-5 bg-white z-0'></div> */}
                  <div className={`border-[1px] w-full py-1 flex justify-center items-center px-1 text-center max-[550px]:text-sm rounded-md ${!displayError[robotID] ? 'opacity-0 h-0 p-0' : 'opacity-1'} ${robotError[robotID] === 1 ? 'bg-[rgb(255,0,0)] border-white text-white' : 'text-[#00000053] border-[#00000053]'}`}>Low Battery</div>
                  <div className={`border-[1px] w-full py-1 flex justify-center items-center px-1 text-center max-[550px]:text-sm rounded-md ${!displayError[robotID] ? 'opacity-0 h-0 p-0' : 'opacity-1'} ${robotError[robotID] === 2 ? 'bg-[rgb(255,0,0)] border-white text-white' : 'text-[#00000053] border-[#00000053]'}`}>Brush OC</div>
                  <div className={`border-[1px] w-full py-1 flex justify-center items-center px-1 text-center max-[550px]:text-sm rounded-md ${!displayError[robotID] ? 'opacity-0 h-0 p-0' : 'opacity-1'} ${robotError[robotID] === 3 ? 'bg-[rgb(255,0,0)] border-white text-white' : 'text-[#00000053] border-[#00000053]'}`}>Wheel OC</div>
                  <div className={`border-[1px] w-full py-1 flex justify-center items-center px-1 text-center max-[550px]:text-sm rounded-md ${!displayError[robotID] ? 'opacity-0 h-0 p-0' : 'opacity-1'} ${robotError[robotID] === 4 ? 'bg-[rgb(255,0,0)] border-white text-white' : 'text-[#00000053] border-[#00000053]'}`}>Robot Stuck</div>
                </div>
              </div>
            </div></> :
          ((robotError[robotID] == 0) && (networkError[robotID] == 0)) ?
            <BlinkingText
              key={robotID}
              data={{ BV: robotData.BV, OT: robotData.OT }}
              color={"green"}
              childElement={
                <div
                  key={robotID}
                  className={`cards  w-[100%] flex transition-colors duration-300 justify-between items-center rounded-lg px-4 py-3 max-[550px]:px-3 max-[550px]:py-1`}
                >
                  <div className='text-xl max-[400px]:text-[17px]'>{`Robot ${parseInt(robotID.slice(1))}`}</div>
                  <div className='flex gap-4'>
                    <div className='flex flex-col items-end'>
                      <div className='text-sm font-semibold max-[495px]:text-[12px]'>Battery Voltage</div>
                      <div className='text-3xl transition-all duration-300 max-[495px]:text-[25px]'>
                        {(((robotData.BV - 21) / (29.2 - 21)) * 100).toFixed(2) + '%'}
                      </div>
                    </div>
                    <div className='flex flex-col items-end'>
                      <div className='text-sm font-semibold max-[495px]:text-[12px]'>Operational Time</div>
                      <div className='text-3xl transition-all duration-300 max-[495px]:text-[25px]'>
                        {/* <BlinkingText text={`${robotData.OT}s`} /> */}
                        {`${Math.floor(robotData.OT / 60)}`}
                        <span className='text-[25px] max-[495px]:text-[20px]'>mins</span>
                      </div>
                    </div>
                  </div>
                </div>
              }
            /> :
            (!networkError[robotID]) ?
              <div className='w-full flex gap-3 transition-all duration-300'>
                <BlinkingText
                  key={robotID}
                  data={{ BV: robotData.BV, OT: robotData.OT }}
                  color={"red"}
                  childElement={
                    <div>
                      <div
                        key={robotID}
                        className={`cards w-[100%] flex transition-all duration-300 justify-between items-center rounded-lg px-4 py-3 max-[550px]:px-3 max-[550px]:py-2`}
                      >
                        <div className='flex flex-col'>
                          <div className='text-xl max-[400px]:text-[17px]'>{`Robot ${parseInt(robotID.slice(1))}`}</div>
                          <div className='flex gap-1 min-[768px]:hidden'>
                            <div className='flex items-center gap-2'>
                              <img src={battery} className='size-5 max-[550px]:size-4' />
                              <div className='text-lg max-[550px]:text-sm transition-all duration-300'>
                                {(((robotData.BV - 21) / (29.2 - 21)) * 100).toFixed(2) + '%'}
                              </div>
                            </div>
                            <div className='font-medium'>|</div>
                            <div className='flex items-center gap-2'>
                              <img src={timer} className='size-6 max-[550px]:size-4' />
                              <div className='text-lg max-[550px]:text-sm flex mt-[1px] items-center transition-all duration-300'>
                                {`${Math.floor(robotData.OT / 60)}`}
                                <span className='text-lg max-[550px]:text-sm'>mins</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <><div className='flex gap-4'>
                          <div className='flex flex-col items-end  max-[768px]:hidden'>
                            <div className='text-sm font-semibold'>Battery Voltage</div>
                            <div className='text-3xl transition-all duration-300'>
                              {/* <BlinkingText text={(((robotData.BV - 21) / (29.2 - 21)) * 100).toFixed(2) + '%'} /> */}
                              {(((robotData.BV - 21) / (29.2 - 21)) * 100).toFixed(2) + '%'}
                            </div>
                          </div>
                          <div className='flex flex-col items-end max-[768px]:hidden'>
                            <div className='text-sm font-semibold'>Operational Time</div>
                            <div className='text-3xl'>
                              {/* <BlinkingText text={`${robotData.OT}s`} /> */}
                              {`${Math.floor(robotData.OT / 60)}`}
                              <span className='text-[25px]'>mins</span>
                            </div>
                          </div>
                          <div className='flex gap-4 items-center'>
                            {/* <div onMouseEnter={() => { setDisplayError(prev => ({ ...prev, [robotID]: 1 })) }} onMouseLeave={() => { setDisplayError(prev => ({ ...prev, [robotID]: 0 })) }} className='bg-[rgb(255,0,0)] text-white border-[1px] shadow-[0_0px_20px_1px_rgba(0,0,0,0.29)] cursor-pointer px-4 py-1 ml-3 flex items-center gap-2 rounded-md text-2xl w-full min-h-[60%]'> */}
                            <div onClick={() => { setDisplayError(prev => ({ ...prev, [robotID]: !prev[robotID] })) }} className='bg-[rgb(255,0,0)] text-white border-[1px] shadow-[0_0px_20px_1px_rgba(0,0,0,0.29)] cursor-pointer px-4 py-1 max-[550px]:px-3 max-[550px]:py-3 max-[550px]:gap-1 ml-3 flex items-center gap-2 rounded-md text-2xl w-fit min-h-[60%]'>
                              <span className='max-[550px]:text-sm'>Errors</span>
                              <span className={`invert size-6 max-[550px]:size-4 ${displayError[robotID] ? "rotate-[270deg]" : "rotate-90"} transition-all duration-300`}><img src={arrow}></img></span>
                            </div>
                          </div>
                        </div>
                        </>
                      </div>
                      <div className={`flex justify-around rounded-md gap-3  relative transition-all duration-300 ${!displayError[robotID] ? 'opacity-0 px-2 h-0' : 'opacity-1 mb-2 h-fit px-2'}`}>
                        {/* <div className='absolute top-[-10px] rotate-45 right-10 size-5 bg-white z-0'></div> */}
                        <div className={`border-[1px] w-full py-1 flex justify-center items-center px-1 text-center max-[550px]:text-sm rounded-md ${!displayError[robotID] ? 'opacity-0 h-0 p-0' : 'opacity-1'} ${robotError[robotID] === 1 ? 'bg-[rgb(255,0,0)] border-white text-white' : 'text-[#00000053] border-[#00000053]'}`}>Low Battery</div>
                        <div className={`border-[1px] w-full py-1 flex justify-center items-center px-1 text-center max-[550px]:text-sm rounded-md ${!displayError[robotID] ? 'opacity-0 h-0 p-0' : 'opacity-1'} ${robotError[robotID] === 2 ? 'bg-[rgb(255,0,0)] border-white text-white' : 'text-[#00000053] border-[#00000053]'}`}>Brush OC</div>
                        <div className={`border-[1px] w-full py-1 flex justify-center items-center px-1 text-center max-[550px]:text-sm rounded-md ${!displayError[robotID] ? 'opacity-0 h-0 p-0' : 'opacity-1'} ${robotError[robotID] === 3 ? 'bg-[rgb(255,0,0)] border-white text-white' : 'text-[#00000053] border-[#00000053]'}`}>Wheel OC</div>
                        <div className={`border-[1px] w-full py-1 flex justify-center items-center px-1 text-center max-[550px]:text-sm rounded-md ${!displayError[robotID] ? 'opacity-0 h-0 p-0' : 'opacity-1'} ${robotError[robotID] === 4 ? 'bg-[rgb(255,0,0)] border-white text-white' : 'text-[#00000053] border-[#00000053]'}`}>Robot Stuck</div>
                      </div>
                    </div>

                  } />
              </div> :
              <BlinkingText
                key={robotID}
                data={{ BV: robotData.BV, OT: robotData.OT }}
                color={"red"}
                childElement={
                  <div
                    key={robotID}
                    className={`cards w-[100%] flex transition-colors duration-300 justify-between items-center rounded-lg px-4 py-3 max-[550px]:px-3 max-[550px]:py-2`}
                  >
                    <div className='flex flex-col'>
                      <div className='text-xl max-[400px]:text-[17px]'>{`Robot ${parseInt(robotID.slice(1))}`}</div>
                      <div className='flex gap-1 min-[768px]:hidden'>
                        <div className='flex items-center gap-2'>
                          <img src={battery} className='size-5 max-[550px]:size-4' />
                          <div className='text-lg max-[550px]:text-sm transition-all duration-300'>
                            {(((robotData.BV - 21) / (29.2 - 21)) * 100).toFixed(2) + '%'}
                          </div>
                        </div>
                        <div className='font-medium mb-[3px]'>|</div>
                        <div className='flex items-center gap-2'>
                          <img src={timer} className='size-6 max-[550px]:size-4' />
                          <div className='text-lg max-[550px]:text-sm flex mt-[1px] items-center transition-all duration-300'>
                            {`${Math.floor(robotData.OT / 60)}`}
                            <span className='text-lg max-[550px]:text-sm'>mins</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className='flex items-center'>
                      <div className='flex gap-4 '>
                        <div className='flex flex-col items-end max-[768px]:hidden '>
                          <div className='text-sm font-semibold'>Battery Voltage</div>
                          <div className='text-3xl transition-all duration-300'>
                            {/* <BlinkingText text={(((robotData.BV - 21) / (29.2 - 21)) * 100).toFixed(2) + '%'} /> */}
                            {(((robotData.BV - 21) / (29.2 - 21)) * 100).toFixed(2) + '%'}
                          </div>
                        </div>
                        <div className='flex flex-col items-end max-[768px]:hidden'>
                          <div className='text-sm font-semibold'>Operational Time</div>
                          <div className='text-3xl'>
                            {/* <BlinkingText text={`${robotData.OT}s`} /> */}
                            {`${Math.floor(robotData.OT / 60)}`}
                            <span className='text-[25px]'>mins</span>
                          </div>
                        </div>
                        <div className='flex gap-4 items-center'>
                          <div className='bg-[rgb(255,0,0)] text-white border-[1px] shadow-[0_0px_20px_1px_rgba(0,0,0,0.29)] text-center px-3 py-1 ml-3 rounded-md text-2xl min-h-[60%] max-[550px]:text-sm max-[550px]:py-3'>Network Error</div>
                        </div>
                      </div>
                    </div>
                  </div>
                } />
      ))
  )
}

export default CardMapping
