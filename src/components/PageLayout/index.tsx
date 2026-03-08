import { ReactNode, FC } from 'react';
import styles from './PageLayout.module.css';

interface PageLayoutProps {
  title: string;
  stats?: ReactNode;
  children: ReactNode;
  className?: string;
  containerClassName?: string;
}

export const PageLayout: FC<PageLayoutProps> = ({ 
  title, 
  stats, 
  children, 
  className, 
  containerClassName 
}) => {
  return (
    <div className={`${styles.dashboardContainer} ${containerClassName || ''}`}>
      <div className={styles.headerRow}>
        <h2 className={styles.pageTitle}>{title}</h2>
        {stats && (
          <div className={styles.statsOverview}>
            {stats}
          </div>
        )}
      </div>

      <div className={className || styles.content}>
        {children}
      </div>
    </div>
  );
};

export default PageLayout;
