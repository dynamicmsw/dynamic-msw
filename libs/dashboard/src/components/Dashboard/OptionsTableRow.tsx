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
  isActive?: boolean;
}

export const OptionsTableRow: FC<OptionsTableRowProps> = ({
  rowTitle,
  index,
  hasMockOptions,
  openPageURL,
  bootstrapScenario,
  children,
  isActive,
}) => (
  <TableRow key={rowTitle}>
    <TableCell>
      <Spacing
        pl={2}
        css={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
        }}
      >
        <span
          css={(theme) => ({
            display: 'inline-block',
            borderRadius: '100%',
            width: '20px',
            height: '20px',
            border: 'solid 2px #d8d8d8',
            background: isActive ? theme.colors.romance : theme.colors.warmPink,
          })}
        />
      </Spacing>
    </TableCell>

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
        <TableCell row={index + 2} columnStart={1} columnEnd={5}>
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

    <TableCell>
      <Spacing
        pr={2}
        css={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          height: '100%',
        }}
      >
        <Spacing pl={2} />
        {Boolean(openPageURL || bootstrapScenario) && (
          <Flex flow="row" gap={2}>
            <a
              href={openPageURL}
              onClick={bootstrapScenario}
              target="_blank"
              rel="noreferrer"
            >
              <Button
                variant={
                  (isActive && bootstrapScenario && 'primary') || 'secondary'
                }
                size="s"
                css={{ whiteSpace: 'nowrap' }}
              >
                {(isActive && bootstrapScenario && 'Stop scenario') ||
                  (bootstrapScenario && 'Bootstrap scenario') ||
                  'Open page'}
              </Button>
            </a>
            {isActive && bootstrapScenario && (
              <a href={openPageURL} target="_blank" rel="noreferrer">
                <Button
                  variant="secondary"
                  size="s"
                  css={{ whiteSpace: 'nowrap' }}
                >
                  Open page
                </Button>
              </a>
            )}
          </Flex>
        )}
      </Spacing>
    </TableCell>
  </TableRow>
);
