import {
  TableRow,
  TableCell,
  ExpansionPanel,
  Button,
  Spacing,
  Stack,
} from '@stela-ui/react';
import type { FC } from 'react';

interface OptionsTableRowProps {
  rowTitle: string;
  index: number;
  hasMockOptions: boolean;
  openPageURL?: string;
  bootstrapScenario?: React.MouseEventHandler<HTMLAnchorElement>;
  children: React.ReactNode | React.ReactNode[];
}

export const OptionsTableRow: FC<OptionsTableRowProps> = ({
  rowTitle,
  index,
  hasMockOptions,
  openPageURL,
  bootstrapScenario,
  children,
}) => (
  <div
    key={rowTitle}
    css={{
      display: 'contents',
      '> * > *, summary': { display: 'flex', alignItems: 'center' },
      '&:nth-child(odd) div, &:nth-child(odd) summary, &:nth-child(odd) details':
        {
          background: '#f9f9f9',
        },
      '&:nth-child(even) div, &:nth-child(even) summary,  &:nth-child(even) details':
        {
          background: '#ededed',
        },
    }}
  >
    <TableRow>
      <TableCell>
        <Spacing pl={2}>
          <h4 data-testid="scenario-title">{rowTitle}</h4>
        </Spacing>
      </TableCell>

      {hasMockOptions ? (
        <ExpansionPanel
          title="Configure"
          contextId={rowTitle}
          data-testid="configure-panel"
        >
          <TableCell row={index + 2} columnStart={1} columnEnd={4}>
            <Spacing px={2} pb={3}>
              <Stack gap={3}>{children}</Stack>
            </Spacing>
          </TableCell>
        </ExpansionPanel>
      ) : (
        <TableCell>
          <h5>no options</h5>
        </TableCell>
      )}

      {openPageURL || bootstrapScenario ? (
        <TableCell>
          <Spacing pr={2} css={{ textAlign: 'right' }}>
            <a
              href={openPageURL}
              onClick={bootstrapScenario}
              target="_blank"
              rel="noreferrer"
            >
              <Button>
                {bootstrapScenario ? 'Bootstrap scenario' : 'Open page'}
              </Button>
            </a>
          </Spacing>
        </TableCell>
      ) : (
        <TableCell>
          <div />
        </TableCell>
      )}
    </TableRow>
  </div>
);
