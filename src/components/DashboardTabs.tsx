import { Box, Container, Tab, Tabs, Typography, Card } from "@mui/material";
import React, { useState, ReactNode, ReactElement} from "react";
import { capitalCase } from "change-case";
import Link from "next/link" ;

interface TabItem {
  value: string;
  icon?: ReactElement | string;
  path?: string;
  // component: ReactNode | ((props: { currentUserProfileId: string }) => ReactNode);
  component: ReactNode
}

interface DashboardTabsProps {
  tabs: TabItem[];
  title: string;
 currentUserProfileId?: string;
  defaultTab: string;
}

function DashboardTabs({ tabs, title, currentUserProfileId, defaultTab }: DashboardTabsProps) {
  const [currentTab, setCurrentTab] = useState<string>(defaultTab);

  return (
    <Container
      maxWidth={false}
      disableGutters
      sx={{
        backgroundImage: 'url(/assets/hero-bg.png)',
        backgroundSize: 'cover',
       flexGrow: 1,
       display: 'flex',
       flexDirection: 'column'
      }}
    >
      <Box sx={{ pl: '15%', pr: '15%', mb: 2 }}>
        <Typography variant="h5" gutterBottom sx={{ mt: 5 }}>
          {title}
        </Typography>
        <Tabs value={currentTab} scrollButtons="auto" variant="scrollable" allowScrollButtonsMobile onChange={(e, value) => setCurrentTab(value)}>
          {tabs.map(tab => (
            <Tab disableRipple key={tab.value} label={capitalCase(tab.value)} icon={tab.icon} value={tab.value}/>
          ))}
        </Tabs>
      </Box>

      <Box
        sx={{
          bgcolor: 'primary.light',
          width: '100%',
          flexGrow: 1,
          pt: 5,
          pb: 5,
        }}
      >
        {tabs.map(tab => {
          const isMatched = tab.value === currentTab;
          return (
            isMatched && (
              <Card key={tab.value} sx={{ ml: '15%', mr: '15%', p: 2}}>
             {tab.component}
                {/* {typeof tab.component === 'function' ? tab.component({ currentUserProfileId }) : tab.component} */}
              </Card>
            )
          );
        })}
      </Box>
    </Container>
  );
}

export default DashboardTabs;