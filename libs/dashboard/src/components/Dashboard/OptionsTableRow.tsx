import {
  TableRow,
  TableCell,
  ExpansionPanel,
  Button,
  Spacing,
  Flex,
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
  <TableRow key={rowTitle}>
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
        buttonProps={{ size: 's' }}
      >
        <TableCell row={index + 2} columnStart={1} columnEnd={4}>
          <Spacing px={2} pb={3}>
            {children}
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
        <Spacing
          pr={2}
          css={{
            textAlign: 'right',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            height: '100%',
          }}
        >
          <a
            href={openPageURL}
            onClick={bootstrapScenario}
            target="_blank"
            rel="noreferrer"
          >
            <Button variant="secondary" size="s">
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
);
