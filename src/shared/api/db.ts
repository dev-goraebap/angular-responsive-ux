import Dexie, { type EntityTable, type Table } from 'dexie';
import { SEED_GENRES, SEED_MOVIES } from './seed';

/**
 * 영화 한 편.
 * 업무: 카탈로그의 핵심 엔티티. 영화·장르는 읽기 전용 목 데이터다.
 */
export interface Movie {
  id: string;
  title: string;
  originalTitle?: string;
  year: number;
  /** 장르 키 목록. 다중 인덱스(*genres)로 장르별 조회를 받는다. */
  genres: string[];
  runtime: number;
  synopsis: string;
  director: string;
  cast: string[];
  /** 포스터 대체 색(목 데이터라 실제 이미지 대신 컬러 블록). */
  posterColor: string;
  posterUrl?: string;
  ratingAverage: number;
  ratingCount: number;
  featured: boolean;
}

/** 장르. */
export interface Genre {
  key: string;
  label: string;
}

/**
 * 위시리스트 항목.
 * 업무: 회원이 담은 영화. (userId, movieId)가 자연 키다.
 */
export interface WishlistItem {
  userId: string;
  movieId: string;
  addedAt: string;
}

/**
 * 내 평점.
 * 업무: 회원이 한 영화에 남긴 별점(1~5). (userId, movieId)가 자연 키다.
 */
export interface Rating {
  userId: string;
  movieId: string;
  score: number;
  ratedAt: string;
}

/**
 * 앱의 IndexedDB 스키마. 영속화 인프라일 뿐 업무 규칙은 두지 않는다(FSD: shared).
 */
class AppDB extends Dexie {
  // '!' — 스키마 정의 후 Dexie가 채워 넣는다.
  movies!: EntityTable<Movie, 'id'>;
  genres!: EntityTable<Genre, 'key'>;
  // 복합 키([userId, movieId]) 테이블은 Table<T, 키튜플>로 둔다.
  wishlist!: Table<WishlistItem, [string, string]>;
  ratings!: Table<Rating, [string, string]>;

  constructor() {
    super('responsive-ux');
    this.version(1).stores({
      // *genres = 다중 인덱스(장르별), year·ratingAverage = 정렬/필터 인덱스.
      // featured는 boolean이라 인덱스 대상이 아니다(IndexedDB는 불리언 키 미지원) → 메모리 필터로 거른다.
      movies: 'id, year, ratingAverage, *genres',
      genres: 'key',
      // [userId+movieId] = 복합 기본 키, userId = 회원별 조회 인덱스.
      wishlist: '[userId+movieId], userId, addedAt',
      ratings: '[userId+movieId], userId, movieId',
    });

    // 기술: populate는 DB가 처음 생성될 때 한 번만 실행된다. 읽기 전용 카탈로그를 시드한다.
    this.on('populate', () => {
      this.genres.bulkAdd(SEED_GENRES);
      this.movies.bulkAdd(SEED_MOVIES);
    });
  }
}

/** 단일 DB 인스턴스. 저장소 서비스만 직접 참조한다. */
export const db = new AppDB();
