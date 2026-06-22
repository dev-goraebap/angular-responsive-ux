import { Service } from '@angular/core';
import { db, type Rating } from './db';

/**
 * 평점 저장소.
 * 업무: 회원이 한 영화에 남긴 별점(1~5)을 (userId, movieId)로 관리한다. 한 영화당 한 평점이다.
 * 인증/세션은 ADR-0006에서 다루므로 여기서는 userId를 받기만 한다.
 */
@Service()
export class RatingRepository {
  /** 회원이 남긴 평점 목록(최근 평가 순). */
  list(userId: string): Promise<Rating[]> {
    return db.ratings.where('userId').equals(userId).reverse().sortBy('ratedAt');
  }

  get(userId: string, movieId: string): Promise<Rating | undefined> {
    return db.ratings.get([userId, movieId]);
  }

  /** 별점 남기기/수정. 같은 영화면 덮어쓴다(put). */
  async set(userId: string, movieId: string, score: number, ratedAt: string): Promise<void> {
    await db.ratings.put({ userId, movieId, score, ratedAt });
  }

  async remove(userId: string, movieId: string): Promise<void> {
    await db.ratings.delete([userId, movieId]);
  }
}
