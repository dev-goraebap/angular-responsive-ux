import { Service } from '@angular/core';
import { db, type WishlistItem } from './db';

/**
 * 위시리스트 저장소.
 * 업무: 회원이 담은 영화를 (userId, movieId)로 관리한다. 같은 영화를 두 번 담아도 한 건이다.
 * 인증/세션은 ADR-0006에서 다루므로 여기서는 userId를 받기만 한다.
 */
@Service()
export class WishlistRepository {
  /** 회원의 위시리스트(최근 담은 순). */
  list(userId: string): Promise<WishlistItem[]> {
    return db.wishlist.where('userId').equals(userId).reverse().sortBy('addedAt');
  }

  has(userId: string, movieId: string): Promise<boolean> {
    return db.wishlist.get([userId, movieId]).then((it) => it !== undefined);
  }

  /** 담기. 이미 있으면 addedAt만 갱신된다(put). */
  async add(userId: string, movieId: string, addedAt: string): Promise<void> {
    await db.wishlist.put({ userId, movieId, addedAt });
  }

  async remove(userId: string, movieId: string): Promise<void> {
    await db.wishlist.delete([userId, movieId]);
  }
}
