import styles from './Profile.module.css';
import Button from '@/components/Button';
import { PageLayout } from '@/components/PageLayout';

export const ProfileDashboard = () => {
  return (
    <PageLayout title="My Profile">
      <div className={styles.profileHeader}>
        <div className={styles.avatarBox}>
          <span className={styles.avatarInitial}>B</span>
        </div>
        <div className={styles.userBasicInfo}>
          <h2 className={styles.userName}>Baker Beta</h2>
          <p className={styles.userJoinDate}>Joined Feb 2024 • Artisan Level</p>
        </div>
        <Button className={styles.editProfileBtn}>Edit Profile</Button>
      </div>

      <div className={styles.profileGrid}>
        <div className={styles.profileCard}>
          <h3 className={styles.cardTitle}>Baking Statistics</h3>
          <div className={styles.statsList}>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Total Flour Used</span>
              <span className={styles.statValue}>12.5 kg</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Success Rate</span>
              <span className={styles.statValue}>94%</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Favorite Hydration</span>
              <span className={styles.statValue}>75%</span>
            </div>
          </div>
        </div>

        <div className={styles.profileCard}>
          <h3 className={styles.cardTitle}>App Preferences</h3>
          <div className={styles.prefList}>
            <div className={styles.prefItem}>
              <span>Default Temperature Units</span>
              <span className={styles.prefToggle}>°C</span>
            </div>
            <div className={styles.prefItem}>
              <span>Compact Results View</span>
              <span className={styles.prefToggle}>OFF</span>
            </div>
            <div className={styles.prefItem}>
              <span>Email Notifications</span>
              <span className={styles.prefToggle}>ON</span>
            </div>
          </div>
        </div>

        <div className={`${styles.profileCard} ${styles.achievementsCard}`}>
          <h3 className={styles.cardTitle}>Achievements</h3>
          <div className={styles.achievementGrid}>
            <div className={styles.badge} title="First Bake">🥖</div>
            <div className={styles.badge} title="Hydration King">💧</div>
            <div className={styles.badge} title="Perfect Score">★</div>
            <div className={styles.badge} title="Early Riser">🌅</div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};
