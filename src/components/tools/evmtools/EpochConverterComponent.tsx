'use client';
import React, { useEffect, useState } from 'react';
import { Label } from '@shadcn-components/ui/label';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@shadcn-components/ui/card';
import { Button } from '@shadcn-components/ui/button';
import { Input } from '@shadcn-components/ui/input';
import { Separator } from '@shadcn-components/ui/separator';
import { isNaN } from 'lodash';

const LiveUnixTimestamp: React.FC = () => {
  const [currentUnixTimestamp, setCurrentUnixTimestamp] = useState<number>(
    Math.floor(Date.now() / 1000),
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentUnixTimestamp(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <Label>Current Unix Timestamp</Label>
      <p>{currentUnixTimestamp}</p>
    </div>
  );
};

const EpochConverterComponent: React.FC = () => {
  const [unixTimestamp, setUnixTimestamp] = useState<string>(
    Math.floor(Date.now() / 1000).toString(),
  );
  const [convertedUnixTs, setConvertedUnixTs] = useState<string>('');
  const [humanDate, setHumanDate] = useState<string>(
    new Date(Math.floor(Date.now() / 1000) * 1000)
      .toISOString()
      .replace('T', ' ')
      .substring(0, 19),
  );

  const [secondsInput, setSecondsInput] = useState<string>('');
  const [convertedTime, setConvertedTime] = useState<string>('');

  const handleUnixToHuman = () => {
    if (isNaN(unixTimestamp)) {
      return;
    }
    try {
      const date = new Date(Number(unixTimestamp) * 1000);
      setHumanDate(date.toISOString().replace('T', ' ').substring(0, 19));
    } catch (e) {
      // invalid date
    }
  };

  const handleHumanToUnix = () => {
    try {
      const date = new Date(humanDate + 'Z');
      setConvertedUnixTs(Math.floor(date.getTime() / 1000).toString());
    } catch (e) {
      // invalid date
    }
  };

  const handleSecondsConversion = () => {
    const totalSeconds = parseInt(secondsInput);
    if (isNaN(totalSeconds)) {
      return;
    }

    const days = Math.floor(totalSeconds / (24 * 3600));
    const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    setConvertedTime(
      `${days} days, ${hours} hours, ${minutes} minutes and ${seconds} seconds.`,
    );
  };

  return (
    <div className="flex flex-row justify-center">
      <div className="max-w-[480px] w-[100%]">
        <div className="">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Epoch Converter</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-4">
                <LiveUnixTimestamp />

                <div>
                  <Label htmlFor="unixTimestamp">Epoch timestamp</Label>
                  <Input
                    id="unixTimestamp"
                    type="text"
                    value={unixTimestamp}
                    onChange={(e) => {
                      setUnixTimestamp(e.target.value);
                    }}
                    placeholder="Enter Unix timestamp"
                  />
                  <Button onClick={handleUnixToHuman} className="w-full">
                    Timestamp to Human date
                  </Button>

                  {humanDate && (
                    <div>
                      <p>GMT: {humanDate}</p>
                    </div>
                  )}
                </div>
                <div>
                  <Label htmlFor="humanDate">Human date and time (GMT):</Label>
                  <Input
                    type="text"
                    value={humanDate}
                    onChange={(e) => setHumanDate(e.target.value)}
                    placeholder="Enter human-readable date (YYYY-MM-DD HH:mm:ss)"
                  />

                  <Button onClick={handleHumanToUnix} className="w-full">
                    Human date to Timestamp
                  </Button>
                </div>

                {convertedUnixTs && (
                  <div>
                    <p>Unix: {convertedUnixTs}</p>
                    {/* <p>
                      Relative: &nbsp;
                      {unixTimestamp &&
                        formatRelativeTime(Number(unixTimestamp))}
                    </p> */}
                  </div>
                )}

                <div>
                  <Separator className="mb-2" />
                  <Label>Seconds Helper</Label>
                  <Input
                    type="text"
                    value={secondsInput}
                    onChange={(e) => setSecondsInput(e.target.value)}
                    placeholder="Enter seconds"
                  />
                  <Button onClick={handleSecondsConversion} className="w-full">
                    Seconds to days, hours, minutes
                  </Button>
                  <p>{convertedTime}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EpochConverterComponent;
