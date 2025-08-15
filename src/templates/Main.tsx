import { SiteHeader } from '@components/global-header';
import { PageWrapper } from '@components/page-wrapper';
import { ReactNode } from 'react';
import { GlobalFooter } from '@components/global-footer';
import ToolCarousel from '@components/common/ToolCarousel';
import { playgroundToolKeyRecord, playgroundToolsList } from '@data/playground';
import { CommandMenu } from '@components/common/GlobalSearch';

type IMainProps = {
  meta: ReactNode;
  children: ReactNode;
  showConnectWallet?: boolean;
  link?: string;
  bannerNotVisible?: boolean;
  searchVisible?: boolean;
};

const Main = (props: IMainProps) => {
  const { searchVisible = false } = props;
  return (
    <div>
      {props.meta}
      <div style={{ paddingLeft: '0px', paddingTop: '0px' }}>
        <PageWrapper>
          <SiteHeader showConnectWallet={props?.showConnectWallet} />
          {props?.searchVisible ? (
            <div className="sticky top-[56px] backdrop-blur  z-50 flex-row flex justify-center">
              <CommandMenu />
            </div>
          ) : (
            <div></div>
          )}
          {props?.bannerNotVisible ? (
            <></>
          ) : (
            <div className="flex-row flex justify-center">
              {/* <ClosableAlert /> */} <></>
            </div>
          )}

          <div className="flex flex-col content-between items-center min-h-screen">
            <div className="flex flex-col max-w-[1024px] w-11/12">
              {props.children}
            </div>
          </div>
          <div className="flex flex-col content-between items-center ">
            <div className="flex flex-col content-between max-w-[1024px] w-11/12">
              {props?.link != null && (
                <ToolCarousel
                  playgroundTools={playgroundToolsList.filter(
                    (tool) =>
                      tool.category ==
                        // @ts-ignore
                        playgroundToolKeyRecord[props.link!].category &&
                      tool.link != props.link,
                  )}
                />
              )}
            </div>
          </div>
          <GlobalFooter />
        </PageWrapper>
      </div>
    </div>
  );
};
export { Main };
