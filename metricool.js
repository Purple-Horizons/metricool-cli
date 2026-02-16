#!/usr/bin/env node

import { Command } from 'commander';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from CLI directory
dotenv.config({ path: join(__dirname, '.env') });

const BASE_URL = 'https://app.metricool.com/api';

// Auth credentials from environment
const USER_TOKEN = process.env.METRICOOL_USER_TOKEN;
const USER_ID = process.env.METRICOOL_USER_ID;
const DEFAULT_BLOG_ID = process.env.METRICOOL_BLOG_ID;

// Helper: Add auth params to URL
function addAuthParams(url, blogId = null) {
  const separator = url.includes('?') ? '&' : '?';
  const params = new URLSearchParams();
  params.set('userToken', USER_TOKEN);
  params.set('userId', USER_ID);
  if (blogId) params.set('blogId', blogId);
  return `${url}${separator}${params.toString()}`;
}

// Helper: Make authenticated request
async function apiRequest(endpoint, options = {}, blogId = null) {
  const url = addAuthParams(`${BASE_URL}${endpoint}`, blogId);
  const headers = {
    'Content-Type': 'application/json',
    'X-Mc-Auth': USER_TOKEN,
    ...options.headers,
  };

  try {
    const response = await fetch(url, { ...options, headers });
    const text = await response.text();
    
    if (!response.ok) {
      console.error(`API Error [${response.status}]:`, text);
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    // Try to parse as JSON, return text if it fails
    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  } catch (error) {
    console.error('Request failed:', error.message);
    throw error;
  }
}

// Helper: Output handler
function output(data, jsonFlag) {
  if (jsonFlag) {
    console.log(JSON.stringify(data, null, 2));
  } else {
    console.log(JSON.stringify(data, null, 2));
  }
}

// ============================================================================
// BRANDS & ADMIN COMMANDS
// ============================================================================

async function listBrands(options) {
  const data = await apiRequest('/admin/simpleProfiles');
  output(data, options.json);
}

async function getBestTime(options) {
  const blogId = options.blogId || DEFAULT_BLOG_ID;
  if (!blogId) throw new Error('blogId required (use --blog-id or set METRICOOL_BLOG_ID)');
  
  const data = await apiRequest('/planner/best-time-to-publish', {}, blogId);
  output(data, options.json);
}

// ============================================================================
// POST COMMANDS
// ============================================================================

async function listPosts(options) {
  const blogId = options.blogId || DEFAULT_BLOG_ID;
  if (!blogId) throw new Error('blogId required');

  const params = new URLSearchParams();
  if (options.start) params.set('start', options.start);
  if (options.end) params.set('end', options.end);
  if (options.timezone) params.set('timezone', options.timezone);
  
  const queryString = params.toString();
  const endpoint = `/v2/scheduler/posts${queryString ? `?${queryString}` : ''}`;
  
  const data = await apiRequest(endpoint, {}, blogId);
  output(data, options.json);
}

async function createPost(options) {
  const blogId = options.blogId || DEFAULT_BLOG_ID;
  if (!blogId) throw new Error('blogId required');

  // Convert comma-separated networks to provider objects
  const networks = options.network ? options.network.split(',').map(n => n.trim()) : [];
  const providers = networks.map(network => ({ network }));

  // Parse media URLs if provided
  const media = options.media ? options.media.split(',').map(m => m.trim()) : [];

  // Format date - pass as-is if provided, otherwise use current time in ISO format
  const formatDate = (date) => {
    if (date) {
      // User provided a date - use it as-is, don't convert to UTC
      return date;
    }
    // No date provided - use current time
    const d = new Date();
    return d.toISOString().split('.')[0]; // Remove milliseconds and Z
  };

  // Build post data
  const postData = {
    text: options.text || '',
    providers,
    publicationDate: {
      dateTime: formatDate(options.date),
      timezone: options.timezone || 'America/New_York',
    },
    draft: options.draft || false,
    autoPublish: !options.draft,
    media,
  };

  // Add first comment if provided
  if (options.firstComment) {
    postData.firstCommentText = options.firstComment;
  }

  // Add LinkedIn-specific data
  if (options.linkedinType) {
    postData.linkedinData = {
      type: options.linkedinType,
    };
  }

  // Add Instagram-specific data
  if (options.instagramType) {
    postData.instagramData = {
      type: options.instagramType,
    };
  }

  const data = await apiRequest('/v2/scheduler/posts', {
    method: 'POST',
    body: JSON.stringify(postData),
  }, blogId);

  output(data, options.json);
}

async function updatePost(id, options) {
  const blogId = options.blogId || DEFAULT_BLOG_ID;
  if (!blogId) throw new Error('blogId required');

  const updateData = {};
  
  if (options.text) updateData.text = options.text;
  if (options.date) {
    updateData.publicationDate = {
      dateTime: options.date,
      timezone: options.timezone || 'America/New_York',
    };
  }
  if (options.network) {
    const networks = options.network.split(',').map(n => n.trim());
    updateData.providers = networks.map(network => ({ network }));
  }
  if (options.media) {
    updateData.media = options.media.split(',').map(m => m.trim());
  }

  const data = await apiRequest(`/v2/scheduler/posts/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updateData),
  }, blogId);

  output(data, options.json);
}

async function deletePost(id, options) {
  const blogId = options.blogId || DEFAULT_BLOG_ID;
  if (!blogId) throw new Error('blogId required');

  await apiRequest(`/v2/scheduler/posts/${id}`, {
    method: 'DELETE',
  }, blogId);

  console.log(`Post ${id} deleted successfully`);
}

// ============================================================================
// ANALYTICS COMMANDS
// ============================================================================

async function analyticsTimeline(options) {
  const blogId = options.blogId || DEFAULT_BLOG_ID;
  if (!blogId) throw new Error('blogId required');
  if (!options.metric) throw new Error('--metric required');

  const params = new URLSearchParams();
  if (options.start) params.set('start', options.start);
  if (options.end) params.set('end', options.end);
  if (options.timezone) params.set('timezone', options.timezone);
  
  const queryString = params.toString();
  const endpoint = `/v2/analytics/timelines/${options.metric}${queryString ? `?${queryString}` : ''}`;
  
  const data = await apiRequest(endpoint, {}, blogId);
  output(data, options.json);
}

async function analyticsDistribution(options) {
  const blogId = options.blogId || DEFAULT_BLOG_ID;
  if (!blogId) throw new Error('blogId required');
  if (!options.metric) throw new Error('--metric required');

  const params = new URLSearchParams();
  if (options.start) params.set('start', options.start);
  if (options.end) params.set('end', options.end);
  if (options.timezone) params.set('timezone', options.timezone);
  
  const queryString = params.toString();
  const endpoint = `/v2/analytics/distribution/${options.metric}${queryString ? `?${queryString}` : ''}`;
  
  const data = await apiRequest(endpoint, {}, blogId);
  output(data, options.json);
}

async function analyticsAggregation(options) {
  const blogId = options.blogId || DEFAULT_BLOG_ID;
  if (!blogId) throw new Error('blogId required');
  if (!options.metric) throw new Error('--metric required');

  const params = new URLSearchParams();
  if (options.start) params.set('start', options.start);
  if (options.end) params.set('end', options.end);
  if (options.timezone) params.set('timezone', options.timezone);
  
  const queryString = params.toString();
  const endpoint = `/v2/analytics/aggregation/${options.metric}${queryString ? `?${queryString}` : ''}`;
  
  const data = await apiRequest(endpoint, {}, blogId);
  output(data, options.json);
}

async function analyticsPosts(network, options) {
  const blogId = options.blogId || DEFAULT_BLOG_ID;
  if (!blogId) throw new Error('blogId required');

  const params = new URLSearchParams();
  if (options.start) params.set('start', options.start);
  if (options.end) params.set('end', options.end);
  if (options.timezone) params.set('timezone', options.timezone);
  if (options.sort) params.set('sort', options.sort);
  if (options.order) params.set('order', options.order);
  
  const queryString = params.toString();
  const endpoint = `/v2/analytics/posts/${network}${queryString ? `?${queryString}` : ''}`;
  
  const data = await apiRequest(endpoint, {}, blogId);
  output(data, options.json);
}

async function analyticsReels(network, options) {
  const blogId = options.blogId || DEFAULT_BLOG_ID;
  if (!blogId) throw new Error('blogId required');

  const params = new URLSearchParams();
  if (options.start) params.set('start', options.start);
  if (options.end) params.set('end', options.end);
  if (options.timezone) params.set('timezone', options.timezone);
  
  const queryString = params.toString();
  const endpoint = `/v2/analytics/reels/${network}${queryString ? `?${queryString}` : ''}`;
  
  const data = await apiRequest(endpoint, {}, blogId);
  output(data, options.json);
}

async function analyticsStories(network, options) {
  const blogId = options.blogId || DEFAULT_BLOG_ID;
  if (!blogId) throw new Error('blogId required');

  const params = new URLSearchParams();
  if (options.start) params.set('start', options.start);
  if (options.end) params.set('end', options.end);
  if (options.timezone) params.set('timezone', options.timezone);
  
  const queryString = params.toString();
  const endpoint = `/v2/analytics/stories/${network}${queryString ? `?${queryString}` : ''}`;
  
  const data = await apiRequest(endpoint, {}, blogId);
  output(data, options.json);
}

async function analyticsHashtags(options) {
  const blogId = options.blogId || DEFAULT_BLOG_ID;
  if (!blogId) throw new Error('blogId required');

  const params = new URLSearchParams();
  if (options.start) params.set('start', options.start);
  if (options.end) params.set('end', options.end);
  if (options.timezone) params.set('timezone', options.timezone);
  
  const queryString = params.toString();
  const endpoint = `/v2/analytics/hashtags${queryString ? `?${queryString}` : ''}`;
  
  const data = await apiRequest(endpoint, {}, blogId);
  output(data, options.json);
}

// ============================================================================
// COMPETITORS COMMANDS
// ============================================================================

async function competitorsList(network, options) {
  const blogId = options.blogId || DEFAULT_BLOG_ID;
  if (!blogId) throw new Error('blogId required');

  const endpoint = `/v2/analytics/competitors/${network}`;
  const data = await apiRequest(endpoint, {}, blogId);
  output(data, options.json);
}

async function competitorsAdd(network, options) {
  const blogId = options.blogId || DEFAULT_BLOG_ID;
  if (!blogId) throw new Error('blogId required');
  if (!options.username) throw new Error('--username required');

  const endpoint = `/v2/analytics/competitors/${network}`;
  const data = await apiRequest(endpoint, {
    method: 'POST',
    body: JSON.stringify({ username: options.username }),
  }, blogId);

  output(data, options.json);
}

async function competitorsRemove(network, options) {
  const blogId = options.blogId || DEFAULT_BLOG_ID;
  if (!blogId) throw new Error('blogId required');
  if (!options.id) throw new Error('--id required');

  const endpoint = `/v2/analytics/competitors/${network}/${options.id}`;
  await apiRequest(endpoint, { method: 'DELETE' }, blogId);

  console.log(`Competitor ${options.id} removed from ${network}`);
}

async function competitorsPosts(network, options) {
  const blogId = options.blogId || DEFAULT_BLOG_ID;
  if (!blogId) throw new Error('blogId required');
  if (!options.id) throw new Error('--id required (competitor ID)');

  const params = new URLSearchParams();
  if (options.start) params.set('start', options.start);
  if (options.end) params.set('end', options.end);
  
  const queryString = params.toString();
  const endpoint = `/v2/analytics/competitors/${network}/${options.id}/posts${queryString ? `?${queryString}` : ''}`;
  
  const data = await apiRequest(endpoint, {}, blogId);
  output(data, options.json);
}

async function competitorsTimelines(options) {
  const blogId = options.blogId || DEFAULT_BLOG_ID;
  if (!blogId) throw new Error('blogId required');
  if (!options.metric) throw new Error('--metric required');

  const params = new URLSearchParams();
  if (options.start) params.set('start', options.start);
  if (options.end) params.set('end', options.end);
  if (options.competitorId) params.set('competitorId', options.competitorId);
  
  const queryString = params.toString();
  const endpoint = `/v2/analytics/competitors/timelines/${options.metric}${queryString ? `?${queryString}` : ''}`;
  
  const data = await apiRequest(endpoint, {}, blogId);
  output(data, options.json);
}

// ============================================================================
// INBOX / CONVERSATIONS COMMANDS
// ============================================================================

async function inboxList(options) {
  const blogId = options.blogId || DEFAULT_BLOG_ID;
  if (!blogId) throw new Error('blogId required');

  const params = new URLSearchParams();
  if (options.network) params.set('network', options.network);
  if (options.status) params.set('status', options.status);
  if (options.limit) params.set('limit', options.limit);
  
  const queryString = params.toString();
  const endpoint = `/v2/inbox/conversations${queryString ? `?${queryString}` : ''}`;
  
  const data = await apiRequest(endpoint, {}, blogId);
  output(data, options.json);
}

async function inboxReply(options) {
  const blogId = options.blogId || DEFAULT_BLOG_ID;
  if (!blogId) throw new Error('blogId required');
  if (!options.conversationId) throw new Error('--conversation-id required');
  if (!options.message) throw new Error('--message required');

  const endpoint = `/v2/inbox/conversations`;
  const data = await apiRequest(endpoint, {
    method: 'POST',
    body: JSON.stringify({
      conversationId: options.conversationId,
      message: options.message,
    }),
  }, blogId);

  output(data, options.json);
}

async function inboxComments(options) {
  const blogId = options.blogId || DEFAULT_BLOG_ID;
  if (!blogId) throw new Error('blogId required');

  const params = new URLSearchParams();
  if (options.network) params.set('network', options.network);
  if (options.postId) params.set('postId', options.postId);
  
  const queryString = params.toString();
  const endpoint = `/v2/inbox/post-comments${queryString ? `?${queryString}` : ''}`;
  
  const data = await apiRequest(endpoint, {}, blogId);
  output(data, options.json);
}

async function inboxCommentReply(options) {
  const blogId = options.blogId || DEFAULT_BLOG_ID;
  if (!blogId) throw new Error('blogId required');
  if (!options.commentId) throw new Error('--comment-id required');
  if (!options.message) throw new Error('--message required');

  const endpoint = `/v2/inbox/post-comments`;
  const data = await apiRequest(endpoint, {
    method: 'POST',
    body: JSON.stringify({
      commentId: options.commentId,
      message: options.message,
    }),
  }, blogId);

  output(data, options.json);
}

async function inboxReviews(options) {
  const blogId = options.blogId || DEFAULT_BLOG_ID;
  if (!blogId) throw new Error('blogId required');

  const params = new URLSearchParams();
  if (options.network) params.set('network', options.network);
  
  const queryString = params.toString();
  const endpoint = `/v2/inbox/reviews${queryString ? `?${queryString}` : ''}`;
  
  const data = await apiRequest(endpoint, {}, blogId);
  output(data, options.json);
}

async function inboxReviewReply(options) {
  const blogId = options.blogId || DEFAULT_BLOG_ID;
  if (!blogId) throw new Error('blogId required');
  if (!options.reviewId) throw new Error('--review-id required');
  if (!options.message) throw new Error('--message required');

  const endpoint = `/v2/inbox/reviews`;
  const data = await apiRequest(endpoint, {
    method: 'POST',
    body: JSON.stringify({
      reviewId: options.reviewId,
      message: options.message,
    }),
  }, blogId);

  output(data, options.json);
}

// ============================================================================
// SMART LINKS (LINK IN BIO) COMMANDS
// ============================================================================

async function smartlinksList(options) {
  const blogId = options.blogId || DEFAULT_BLOG_ID;
  if (!blogId) throw new Error('blogId required');

  const endpoint = `/v2/smartlinks`;
  const data = await apiRequest(endpoint, {}, blogId);
  output(data, options.json);
}

async function smartlinksCreate(options) {
  const blogId = options.blogId || DEFAULT_BLOG_ID;
  if (!blogId) throw new Error('blogId required');
  if (!options.title) throw new Error('--title required');
  if (!options.url) throw new Error('--url required');

  const endpoint = `/v2/smartlinks`;
  const data = await apiRequest(endpoint, {
    method: 'POST',
    body: JSON.stringify({
      title: options.title,
      url: options.url,
      description: options.description,
    }),
  }, blogId);

  output(data, options.json);
}

async function smartlinksUpdate(options) {
  const blogId = options.blogId || DEFAULT_BLOG_ID;
  if (!blogId) throw new Error('blogId required');
  if (!options.id) throw new Error('--id required');

  const updateData = {};
  if (options.title) updateData.title = options.title;
  if (options.url) updateData.url = options.url;
  if (options.description) updateData.description = options.description;

  const endpoint = `/v2/smartlinks/${options.id}`;
  const data = await apiRequest(endpoint, {
    method: 'PUT',
    body: JSON.stringify(updateData),
  }, blogId);

  output(data, options.json);
}

async function smartlinksDelete(options) {
  const blogId = options.blogId || DEFAULT_BLOG_ID;
  if (!blogId) throw new Error('blogId required');
  if (!options.id) throw new Error('--id required');

  const endpoint = `/v2/smartlinks/${options.id}`;
  await apiRequest(endpoint, { method: 'DELETE' }, blogId);

  console.log(`Smart link ${options.id} deleted`);
}

async function smartlinksAnalytics(options) {
  const blogId = options.blogId || DEFAULT_BLOG_ID;
  if (!blogId) throw new Error('blogId required');
  if (!options.id) throw new Error('--id required');

  const params = new URLSearchParams();
  if (options.start) params.set('start', options.start);
  if (options.end) params.set('end', options.end);
  
  const queryString = params.toString();
  const endpoint = `/v2/smartlinks/${options.id}/analytics${queryString ? `?${queryString}` : ''}`;
  
  const data = await apiRequest(endpoint, {}, blogId);
  output(data, options.json);
}

// ============================================================================
// AI FEATURES COMMANDS
// ============================================================================

async function aiGenerate(options) {
  const blogId = options.blogId || DEFAULT_BLOG_ID;
  if (!blogId) throw new Error('blogId required');
  if (!options.prompt) throw new Error('--prompt required');

  const endpoint = `/v2/integrations/ai/posts`;
  const data = await apiRequest(endpoint, {
    method: 'POST',
    body: JSON.stringify({
      prompt: options.prompt,
      language: options.language,
      tone: options.tone,
      network: options.network,
    }),
  }, blogId);

  output(data, options.json);
}

async function aiRegenerate(options) {
  const blogId = options.blogId || DEFAULT_BLOG_ID;
  if (!blogId) throw new Error('blogId required');
  if (!options.postId) throw new Error('--post-id required');

  const endpoint = `/v2/integrations/ai/posts/${options.postId}`;
  const data = await apiRequest(endpoint, {
    method: 'PUT',
    body: JSON.stringify({
      language: options.language,
      tone: options.tone,
    }),
  }, blogId);

  output(data, options.json);
}

async function aiQuickAction(options) {
  const blogId = options.blogId || DEFAULT_BLOG_ID;
  if (!blogId) throw new Error('blogId required');
  if (!options.text) throw new Error('--text required');
  if (!options.action) throw new Error('--action required (shorten, lengthen, rephrase, etc.)');

  const endpoint = `/v2/integrations/ai/quick-actions`;
  const data = await apiRequest(endpoint, {
    method: 'POST',
    body: JSON.stringify({
      text: options.text,
      action: options.action,
      language: options.language,
    }),
  }, blogId);

  output(data, options.json);
}

async function aiSchedule(options) {
  const blogId = options.blogId || DEFAULT_BLOG_ID;
  if (!blogId) throw new Error('blogId required');
  if (!options.text) throw new Error('--text required (natural language like "tomorrow at 3pm")');

  const endpoint = `/v2/integrations/ai/natural-language-scheduling`;
  const data = await apiRequest(endpoint, {
    method: 'POST',
    body: JSON.stringify({
      text: options.text,
      timezone: options.timezone || 'America/New_York',
    }),
  }, blogId);

  output(data, options.json);
}

async function aiScheduleStatus(options) {
  const blogId = options.blogId || DEFAULT_BLOG_ID;
  if (!blogId) throw new Error('blogId required');
  if (!options.jobId) throw new Error('--job-id required');

  const endpoint = `/v2/integrations/ai/natural-language-scheduling/${options.jobId}`;
  const data = await apiRequest(endpoint, {}, blogId);
  output(data, options.json);
}

async function aiLanguages(options) {
  const blogId = options.blogId || DEFAULT_BLOG_ID;
  if (!blogId) throw new Error('blogId required');

  const endpoint = `/v2/integrations/ai/languages`;
  const data = await apiRequest(endpoint, {}, blogId);
  output(data, options.json);
}

// ============================================================================
// POST LIBRARY COMMANDS
// ============================================================================

async function libraryList(options) {
  const blogId = options.blogId || DEFAULT_BLOG_ID;
  if (!blogId) throw new Error('blogId required');

  const params = new URLSearchParams();
  if (options.limit) params.set('limit', options.limit);
  if (options.offset) params.set('offset', options.offset);
  
  const queryString = params.toString();
  const endpoint = `/v2/scheduler/library/posts${queryString ? `?${queryString}` : ''}`;
  
  const data = await apiRequest(endpoint, {}, blogId);
  output(data, options.json);
}

async function libraryCreate(options) {
  const blogId = options.blogId || DEFAULT_BLOG_ID;
  if (!blogId) throw new Error('blogId required');
  if (!options.text) throw new Error('--text required');

  const media = options.media ? options.media.split(',').map(m => m.trim()) : [];

  const endpoint = `/v2/scheduler/library/posts`;
  const data = await apiRequest(endpoint, {
    method: 'POST',
    body: JSON.stringify({
      text: options.text,
      media,
    }),
  }, blogId);

  output(data, options.json);
}

async function libraryUpdate(options) {
  const blogId = options.blogId || DEFAULT_BLOG_ID;
  if (!blogId) throw new Error('blogId required');
  if (!options.id) throw new Error('--id required');

  const updateData = {};
  if (options.text) updateData.text = options.text;
  if (options.media) updateData.media = options.media.split(',').map(m => m.trim());

  const endpoint = `/v2/scheduler/library/posts/${options.id}`;
  const data = await apiRequest(endpoint, {
    method: 'PUT',
    body: JSON.stringify(updateData),
  }, blogId);

  output(data, options.json);
}

async function libraryDelete(options) {
  const blogId = options.blogId || DEFAULT_BLOG_ID;
  if (!blogId) throw new Error('blogId required');
  if (!options.id) throw new Error('--id required');

  const endpoint = `/v2/scheduler/library/posts/${options.id}`;
  await apiRequest(endpoint, { method: 'DELETE' }, blogId);

  console.log(`Library post ${options.id} deleted`);
}

// ============================================================================
// POST NOTES & APPROVALS COMMANDS
// ============================================================================

async function postNotes(options) {
  const blogId = options.blogId || DEFAULT_BLOG_ID;
  if (!blogId) throw new Error('blogId required');
  if (!options.postId) throw new Error('--post-id required');

  const endpoint = `/v2/scheduler/posts/${options.postId}/notes`;
  
  if (options.note) {
    // Add a note
    const data = await apiRequest(endpoint, {
      method: 'POST',
      body: JSON.stringify({ note: options.note }),
    }, blogId);
    output(data, options.json);
  } else {
    // Get notes
    const data = await apiRequest(endpoint, {}, blogId);
    output(data, options.json);
  }
}

async function postApprove(options) {
  const blogId = options.blogId || DEFAULT_BLOG_ID;
  if (!blogId) throw new Error('blogId required');
  if (!options.postId) throw new Error('--post-id required');
  if (!options.status) throw new Error('--status required (approved, rejected, pending)');

  const endpoint = `/v2/scheduler/posts/${options.postId}/approval`;
  const data = await apiRequest(endpoint, {
    method: 'PUT',
    body: JSON.stringify({
      status: options.status,
      comment: options.comment,
    }),
  }, blogId);

  output(data, options.json);
}

async function postTasks(options) {
  const blogId = options.blogId || DEFAULT_BLOG_ID;
  if (!blogId) throw new Error('blogId required');

  const params = new URLSearchParams();
  if (options.status) params.set('status', options.status);
  
  const queryString = params.toString();
  const endpoint = `/v2/scheduler/approval-tasks${queryString ? `?${queryString}` : ''}`;
  
  const data = await apiRequest(endpoint, {}, blogId);
  output(data, options.json);
}

// ============================================================================
// HASHTAG TRACKER COMMANDS
// ============================================================================

async function hashtagsList(options) {
  const blogId = options.blogId || DEFAULT_BLOG_ID;
  if (!blogId) throw new Error('blogId required');

  const endpoint = `/v2/hashtags/tracking`;
  const data = await apiRequest(endpoint, {}, blogId);
  output(data, options.json);
}

async function hashtagsCreate(options) {
  const blogId = options.blogId || DEFAULT_BLOG_ID;
  if (!blogId) throw new Error('blogId required');
  if (!options.hashtag) throw new Error('--hashtag required');

  const endpoint = `/v2/hashtags/tracking`;
  const data = await apiRequest(endpoint, {
    method: 'POST',
    body: JSON.stringify({ hashtag: options.hashtag }),
  }, blogId);

  output(data, options.json);
}

async function hashtagsStats(options) {
  const blogId = options.blogId || DEFAULT_BLOG_ID;
  if (!blogId) throw new Error('blogId required');

  const params = new URLSearchParams();
  if (options.start) params.set('start', options.start);
  if (options.end) params.set('end', options.end);
  
  const queryString = params.toString();
  const endpoint = `/v2/hashtags/distribution${queryString ? `?${queryString}` : ''}`;
  
  const data = await apiRequest(endpoint, {}, blogId);
  output(data, options.json);
}

// ============================================================================
// REPORTS COMMANDS
// ============================================================================

async function reportsList(options) {
  const blogId = options.blogId || DEFAULT_BLOG_ID;
  if (!blogId) throw new Error('blogId required');

  const endpoint = `/v2/brands/${blogId}/reports`;
  const data = await apiRequest(endpoint, {}, blogId);
  output(data, options.json);
}

async function reportsStatus(options) {
  const blogId = options.blogId || DEFAULT_BLOG_ID;
  if (!blogId) throw new Error('blogId required');
  if (!options.reportId) throw new Error('--report-id required');

  const endpoint = `/v2/brands/${blogId}/reports/${options.reportId}/status`;
  const data = await apiRequest(endpoint, {}, blogId);
  output(data, options.json);
}

async function reportsConfig(options) {
  const blogId = options.blogId || DEFAULT_BLOG_ID;
  if (!blogId) throw new Error('blogId required');

  const endpoint = `/v2/brands/${blogId}/reports/config`;
  
  if (options.set) {
    // Update config
    const data = await apiRequest(endpoint, {
      method: 'PUT',
      body: JSON.stringify(JSON.parse(options.set)),
    }, blogId);
    output(data, options.json);
  } else {
    // Get config
    const data = await apiRequest(endpoint, {}, blogId);
    output(data, options.json);
  }
}

// ============================================================================
// BRAND/ACCOUNT MANAGEMENT COMMANDS
// ============================================================================

async function brandInfo(options) {
  const blogId = options.blogId || DEFAULT_BLOG_ID;
  if (!blogId) throw new Error('blogId required');

  const endpoint = `/v2/settings/brands/${blogId}`;
  const data = await apiRequest(endpoint, {}, blogId);
  output(data, options.json);
}

async function brandUpdate(options) {
  const blogId = options.blogId || DEFAULT_BLOG_ID;
  if (!blogId) throw new Error('blogId required');

  const updateData = {};
  if (options.name) updateData.name = options.name;
  if (options.timezone) updateData.timezone = options.timezone;

  const endpoint = `/v2/settings/brands/${blogId}`;
  const data = await apiRequest(endpoint, {
    method: 'PATCH',
    body: JSON.stringify(updateData),
  }, blogId);

  output(data, options.json);
}

async function brandConnections(options) {
  const blogId = options.blogId || DEFAULT_BLOG_ID;
  if (!blogId) throw new Error('blogId required');

  const endpoint = `/v2/settings/brands/${blogId}/connections`;
  const data = await apiRequest(endpoint, {}, blogId);
  output(data, options.json);
}

async function brandImages(options) {
  const blogId = options.blogId || DEFAULT_BLOG_ID;
  if (!blogId) throw new Error('blogId required');

  const endpoint = `/v2/settings/brands/${blogId}/images`;
  const data = await apiRequest(endpoint, {}, blogId);
  output(data, options.json);
}

async function userInfo(options) {
  const endpoint = `/v2/settings/users/${USER_ID}`;
  const data = await apiRequest(endpoint, {});
  output(data, options.json);
}

async function subscription(options) {
  const endpoint = `/v2/settings/subscriptions`;
  const data = await apiRequest(endpoint, {});
  output(data, options.json);
}

// ============================================================================
// ADVERTISING COMMANDS
// ============================================================================

async function adsCampaigns(options) {
  const blogId = options.blogId || DEFAULT_BLOG_ID;
  if (!blogId) throw new Error('blogId required');

  const endpoint = `/v2/ads/campaigns`;
  const data = await apiRequest(endpoint, {}, blogId);
  output(data, options.json);
}

async function adsGroups(options) {
  const blogId = options.blogId || DEFAULT_BLOG_ID;
  if (!blogId) throw new Error('blogId required');

  const params = new URLSearchParams();
  if (options.campaignId) params.set('campaignId', options.campaignId);
  
  const queryString = params.toString();
  const endpoint = `/v2/ads/adgroups${queryString ? `?${queryString}` : ''}`;
  
  const data = await apiRequest(endpoint, {}, blogId);
  output(data, options.json);
}

async function adsList(options) {
  const blogId = options.blogId || DEFAULT_BLOG_ID;
  if (!blogId) throw new Error('blogId required');

  const params = new URLSearchParams();
  if (options.adGroupId) params.set('adGroupId', options.adGroupId);
  
  const queryString = params.toString();
  const endpoint = `/v2/ads/ads${queryString ? `?${queryString}` : ''}`;
  
  const data = await apiRequest(endpoint, {}, blogId);
  output(data, options.json);
}

async function adsKeywords(options) {
  const blogId = options.blogId || DEFAULT_BLOG_ID;
  if (!blogId) throw new Error('blogId required');

  const params = new URLSearchParams();
  if (options.adGroupId) params.set('adGroupId', options.adGroupId);
  
  const queryString = params.toString();
  const endpoint = `/v2/ads/keywords${queryString ? `?${queryString}` : ''}`;
  
  const data = await apiRequest(endpoint, {}, blogId);
  output(data, options.json);
}

// ============================================================================
// PERFORMANCE DASHBOARDS COMMANDS
// ============================================================================

async function dashboardList(options) {
  const blogId = options.blogId || DEFAULT_BLOG_ID;
  if (!blogId) throw new Error('blogId required');

  const endpoint = `/v2/dashboards`;
  const data = await apiRequest(endpoint, {}, blogId);
  output(data, options.json);
}

async function dashboardCreate(options) {
  const blogId = options.blogId || DEFAULT_BLOG_ID;
  if (!blogId) throw new Error('blogId required');
  if (!options.name) throw new Error('--name required');

  const endpoint = `/v2/dashboards`;
  const data = await apiRequest(endpoint, {
    method: 'POST',
    body: JSON.stringify({
      name: options.name,
      description: options.description,
    }),
  }, blogId);

  output(data, options.json);
}

async function dashboardAnalytics(options) {
  const blogId = options.blogId || DEFAULT_BLOG_ID;
  if (!blogId) throw new Error('blogId required');
  if (!options.dashboardId) throw new Error('--dashboard-id required');

  const params = new URLSearchParams();
  if (options.start) params.set('start', options.start);
  if (options.end) params.set('end', options.end);
  
  const queryString = params.toString();
  const endpoint = `/v2/dashboards/${options.dashboardId}/analytics${queryString ? `?${queryString}` : ''}`;
  
  const data = await apiRequest(endpoint, {}, blogId);
  output(data, options.json);
}

async function dashboardSync(options) {
  const blogId = options.blogId || DEFAULT_BLOG_ID;
  if (!blogId) throw new Error('blogId required');
  if (!options.dashboardId) throw new Error('--dashboard-id required');

  const endpoint = `/v2/dashboards/${options.dashboardId}/sync`;
  const data = await apiRequest(endpoint, {
    method: 'POST',
  }, blogId);

  output(data, options.json);
}

// ============================================================================
// MEDIA COMMANDS
// ============================================================================

async function mediaImages(options) {
  const blogId = options.blogId || DEFAULT_BLOG_ID;
  if (!blogId) throw new Error('blogId required');

  const params = new URLSearchParams();
  if (options.limit) params.set('limit', options.limit);
  if (options.offset) params.set('offset', options.offset);
  
  const queryString = params.toString();
  const endpoint = `/v2/media/images${queryString ? `?${queryString}` : ''}`;
  
  const data = await apiRequest(endpoint, {}, blogId);
  output(data, options.json);
}

async function mediaVideos(options) {
  const blogId = options.blogId || DEFAULT_BLOG_ID;
  if (!blogId) throw new Error('blogId required');

  const params = new URLSearchParams();
  if (options.limit) params.set('limit', options.limit);
  if (options.offset) params.set('offset', options.offset);
  
  const queryString = params.toString();
  const endpoint = `/v2/media/videos${queryString ? `?${queryString}` : ''}`;
  
  const data = await apiRequest(endpoint, {}, blogId);
  output(data, options.json);
}

async function uploadMedia(options) {
  const blogId = options.blogId || DEFAULT_BLOG_ID;
  if (!blogId) throw new Error('blogId required');
  if (!options.url) throw new Error('--url required');

  // Step 1: Create upload transaction
  const transaction = await apiRequest('/v2/media/s3/upload-transactions', {
    method: 'PUT',
    body: JSON.stringify({
      filename: options.filename || options.url.split('/').pop(),
      contentType: options.contentType || 'image/jpeg',
    }),
  }, blogId);

  output(transaction, options.json);
  return transaction;
}

async function normalizeImageUrl(url, options) {
  const blogId = options.blogId || DEFAULT_BLOG_ID;
  if (!blogId) throw new Error('blogId required');

  const params = new URLSearchParams({ url });
  const endpoint = `/actions/normalize/image/url?${params.toString()}`;
  
  const normalizedUrl = await apiRequest(endpoint, {}, blogId);
  console.log(normalizedUrl);
  return normalizedUrl;
}

// ============================================================================
// CALENDARS COMMANDS
// ============================================================================

async function calendarList(options) {
  const blogId = options.blogId || DEFAULT_BLOG_ID;
  if (!blogId) throw new Error('blogId required');

  const endpoint = `/v2/scheduler/calendars`;
  const data = await apiRequest(endpoint, {}, blogId);
  output(data, options.json);
}

async function calendarEvents(options) {
  const blogId = options.blogId || DEFAULT_BLOG_ID;
  if (!blogId) throw new Error('blogId required');

  const params = new URLSearchParams();
  if (options.start) params.set('start', options.start);
  if (options.end) params.set('end', options.end);
  
  const queryString = params.toString();
  const endpoint = `/v2/scheduler/calendar/events${queryString ? `?${queryString}` : ''}`;
  
  const data = await apiRequest(endpoint, {}, blogId);
  output(data, options.json);
}

async function calendarCreate(options) {
  const blogId = options.blogId || DEFAULT_BLOG_ID;
  if (!blogId) throw new Error('blogId required');
  if (!options.name) throw new Error('--name required');

  const endpoint = `/v2/scheduler/calendars`;
  const data = await apiRequest(endpoint, {
    method: 'POST',
    body: JSON.stringify({
      name: options.name,
      description: options.description,
    }),
  }, blogId);

  output(data, options.json);
}

// ============================================================================
// MISC UTILITIES COMMANDS
// ============================================================================

async function gifSearch(options) {
  const params = new URLSearchParams();
  params.set('offset', options.offset || 0);
  if (options.query) params.set('q', options.query);
  if (options.limit) params.set('limit', options.limit);
  if (options.lang) params.set('lang', options.lang);
  if (options.rating) params.set('rating', options.rating);
  
  const endpoint = `/gifs/search?${params.toString()}`;
  const data = await apiRequest(endpoint, {});
  output(data, options.json);
}

async function suggestions(network, options) {
  const blogId = options.blogId || DEFAULT_BLOG_ID;
  if (!blogId) throw new Error('blogId required');
  if (!options.query) throw new Error('--query required');

  const params = new URLSearchParams();
  params.set('q', options.query);
  
  const endpoint = `/actions/${network}/suggestions?${params.toString()}`;
  const data = await apiRequest(endpoint, {}, blogId);
  output(data, options.json);
}

async function counters(options) {
  const blogId = options.blogId || DEFAULT_BLOG_ID;
  if (!blogId) throw new Error('blogId required');

  const endpoint = `/v2/scheduler/counters`;
  const data = await apiRequest(endpoint, {}, blogId);
  output(data, options.json);
}

async function ping() {
  const endpoint = `/mtr/ping`;
  const data = await apiRequest(endpoint, {});
  console.log(data);
}

// ============================================================================
// LEGACY STATS COMMANDS (kept for backward compatibility)
// ============================================================================

async function getStats(network, options) {
  const blogId = options.blogId || DEFAULT_BLOG_ID;
  if (!blogId) throw new Error('blogId required');

  // Map network to appropriate endpoint
  const endpoints = {
    instagram: '/v2/analytics/instagram/profile',
    facebook: '/v2/analytics/facebook/profile',
    twitter: '/v2/analytics/twitter/profile',
    linkedin: '/v2/analytics/linkedin/profile',
    tiktok: '/v2/analytics/tiktok/profile',
    youtube: '/v2/analytics/youtube/profile',
  };

  const endpoint = endpoints[network.toLowerCase()];
  if (!endpoint) {
    throw new Error(`Unknown network: ${network}. Available: ${Object.keys(endpoints).join(', ')}`);
  }

  const data = await apiRequest(endpoint, {}, blogId);
  output(data, options.json);
}

// ============================================================================
// CLI SETUP
// ============================================================================

const program = new Command();

program
  .name('metricool')
  .description('Metricool CLI - Full API access for social media management')
  .version('2.0.0');

// Brands command
program
  .command('brands')
  .description('List all brands/profiles')
  .option('-j, --json', 'Output as JSON')
  .action(listBrands);

// Best time command
program
  .command('best-time')
  .description('Get best time to publish')
  .option('-b, --blog-id <id>', 'Blog ID')
  .option('-j, --json', 'Output as JSON')
  .action(getBestTime);

// ============================================================================
// POST COMMANDS
// ============================================================================

const post = program.command('post').description('Manage scheduled posts');

post
  .command('list')
  .description('List scheduled posts')
  .option('-s, --start <date>', 'Start date (ISO 8601)')
  .option('-e, --end <date>', 'End date (ISO 8601)')
  .option('-t, --timezone <tz>', 'Timezone (e.g., America/New_York)')
  .option('-b, --blog-id <id>', 'Blog ID')
  .option('-j, --json', 'Output as JSON')
  .action(listPosts);

post
  .command('create')
  .description('Create a new scheduled post')
  .option('-t, --text <text>', 'Post text content')
  .option('-n, --network <networks>', 'Networks (comma-separated: linkedin,instagram,twitter)')
  .option('-m, --media <urls>', 'Media URLs (comma-separated)')
  .option('-d, --date <datetime>', 'Publication date (ISO 8601, e.g., 2026-02-16T11:45:00)')
  .option('-z, --timezone <tz>', 'Timezone', 'America/New_York')
  .option('--draft', 'Create as draft')
  .option('--linkedin-type <type>', 'LinkedIn post type (POST, poll)')
  .option('--instagram-type <type>', 'Instagram post type (POST, REEL, STORY)')
  .option('--first-comment <text>', 'First comment text')
  .option('-b, --blog-id <id>', 'Blog ID')
  .option('-j, --json', 'Output as JSON')
  .action(createPost);

post
  .command('update <id>')
  .description('Update a scheduled post')
  .option('-t, --text <text>', 'New post text')
  .option('-n, --network <networks>', 'Networks (comma-separated)')
  .option('-m, --media <urls>', 'Media URLs (comma-separated)')
  .option('-d, --date <datetime>', 'New publication date (ISO 8601)')
  .option('-z, --timezone <tz>', 'Timezone')
  .option('-b, --blog-id <id>', 'Blog ID')
  .option('-j, --json', 'Output as JSON')
  .action(updatePost);

post
  .command('delete <id>')
  .description('Delete a scheduled post')
  .option('-b, --blog-id <id>', 'Blog ID')
  .action(deletePost);

post
  .command('notes')
  .description('Get or add notes to a post')
  .requiredOption('-p, --post-id <id>', 'Post ID')
  .option('-n, --note <text>', 'Add a note')
  .option('-b, --blog-id <id>', 'Blog ID')
  .option('-j, --json', 'Output as JSON')
  .action(postNotes);

post
  .command('approve')
  .description('Approve or reject a post')
  .requiredOption('-p, --post-id <id>', 'Post ID')
  .requiredOption('-s, --status <status>', 'Status (approved, rejected, pending)')
  .option('-c, --comment <text>', 'Comment')
  .option('-b, --blog-id <id>', 'Blog ID')
  .option('-j, --json', 'Output as JSON')
  .action(postApprove);

post
  .command('tasks')
  .description('Get approval tasks')
  .option('-s, --status <status>', 'Filter by status')
  .option('-b, --blog-id <id>', 'Blog ID')
  .option('-j, --json', 'Output as JSON')
  .action(postTasks);

// ============================================================================
// ANALYTICS COMMANDS
// ============================================================================

const analytics = program.command('analytics').description('Analytics and metrics');

analytics
  .command('timeline')
  .description('Get time series for a metric')
  .requiredOption('-m, --metric <metric>', 'Metric name')
  .option('-s, --start <date>', 'Start date (ISO 8601)')
  .option('-e, --end <date>', 'End date (ISO 8601)')
  .option('-t, --timezone <tz>', 'Timezone')
  .option('-b, --blog-id <id>', 'Blog ID')
  .option('-j, --json', 'Output as JSON')
  .action(analyticsTimeline);

analytics
  .command('distribution')
  .description('Get distribution data for a metric')
  .requiredOption('-m, --metric <metric>', 'Metric name')
  .option('-s, --start <date>', 'Start date (ISO 8601)')
  .option('-e, --end <date>', 'End date (ISO 8601)')
  .option('-t, --timezone <tz>', 'Timezone')
  .option('-b, --blog-id <id>', 'Blog ID')
  .option('-j, --json', 'Output as JSON')
  .action(analyticsDistribution);

analytics
  .command('aggregation')
  .description('Get aggregated metric value')
  .requiredOption('-m, --metric <metric>', 'Metric name')
  .option('-s, --start <date>', 'Start date (ISO 8601)')
  .option('-e, --end <date>', 'End date (ISO 8601)')
  .option('-t, --timezone <tz>', 'Timezone')
  .option('-b, --blog-id <id>', 'Blog ID')
  .option('-j, --json', 'Output as JSON')
  .action(analyticsAggregation);

analytics
  .command('posts <network>')
  .description('Get posts analytics for a network (instagram, linkedin, twitter, facebook, tiktok, threads, bluesky, pinterest)')
  .option('-s, --start <date>', 'Start date (ISO 8601)')
  .option('-e, --end <date>', 'End date (ISO 8601)')
  .option('-t, --timezone <tz>', 'Timezone')
  .option('--sort <field>', 'Sort field')
  .option('--order <asc|desc>', 'Sort order')
  .option('-b, --blog-id <id>', 'Blog ID')
  .option('-j, --json', 'Output as JSON')
  .action(analyticsPosts);

analytics
  .command('reels <network>')
  .description('Get reels analytics for a network')
  .option('-s, --start <date>', 'Start date (ISO 8601)')
  .option('-e, --end <date>', 'End date (ISO 8601)')
  .option('-t, --timezone <tz>', 'Timezone')
  .option('-b, --blog-id <id>', 'Blog ID')
  .option('-j, --json', 'Output as JSON')
  .action(analyticsReels);

analytics
  .command('stories <network>')
  .description('Get stories analytics for a network')
  .option('-s, --start <date>', 'Start date (ISO 8601)')
  .option('-e, --end <date>', 'End date (ISO 8601)')
  .option('-t, --timezone <tz>', 'Timezone')
  .option('-b, --blog-id <id>', 'Blog ID')
  .option('-j, --json', 'Output as JSON')
  .action(analyticsStories);

analytics
  .command('hashtags')
  .description('Get hashtag analytics')
  .option('-s, --start <date>', 'Start date (ISO 8601)')
  .option('-e, --end <date>', 'End date (ISO 8601)')
  .option('-t, --timezone <tz>', 'Timezone')
  .option('-b, --blog-id <id>', 'Blog ID')
  .option('-j, --json', 'Output as JSON')
  .action(analyticsHashtags);

// ============================================================================
// COMPETITORS COMMANDS
// ============================================================================

const competitors = program.command('competitors').description('Competitor tracking');

competitors
  .command('list <network>')
  .description('List competitors for a network')
  .option('-b, --blog-id <id>', 'Blog ID')
  .option('-j, --json', 'Output as JSON')
  .action(competitorsList);

competitors
  .command('add <network>')
  .description('Add a competitor')
  .requiredOption('-u, --username <username>', 'Competitor username')
  .option('-b, --blog-id <id>', 'Blog ID')
  .option('-j, --json', 'Output as JSON')
  .action(competitorsAdd);

competitors
  .command('remove <network>')
  .description('Remove a competitor')
  .requiredOption('-i, --id <id>', 'Competitor ID')
  .option('-b, --blog-id <id>', 'Blog ID')
  .action(competitorsRemove);

competitors
  .command('posts <network>')
  .description('Get competitor posts')
  .requiredOption('-i, --id <id>', 'Competitor ID')
  .option('-s, --start <date>', 'Start date (ISO 8601)')
  .option('-e, --end <date>', 'End date (ISO 8601)')
  .option('-b, --blog-id <id>', 'Blog ID')
  .option('-j, --json', 'Output as JSON')
  .action(competitorsPosts);

competitors
  .command('timelines')
  .description('Get competitor timelines')
  .requiredOption('-m, --metric <metric>', 'Metric name')
  .option('-i, --competitor-id <id>', 'Competitor ID')
  .option('-s, --start <date>', 'Start date (ISO 8601)')
  .option('-e, --end <date>', 'End date (ISO 8601)')
  .option('-b, --blog-id <id>', 'Blog ID')
  .option('-j, --json', 'Output as JSON')
  .action(competitorsTimelines);

// ============================================================================
// INBOX COMMANDS
// ============================================================================

const inbox = program.command('inbox').description('Inbox and conversations');

inbox
  .command('list')
  .description('List conversations')
  .option('-n, --network <network>', 'Filter by network')
  .option('-s, --status <status>', 'Filter by status')
  .option('-l, --limit <limit>', 'Limit results')
  .option('-b, --blog-id <id>', 'Blog ID')
  .option('-j, --json', 'Output as JSON')
  .action(inboxList);

inbox
  .command('reply')
  .description('Reply to a conversation')
  .requiredOption('-c, --conversation-id <id>', 'Conversation ID')
  .requiredOption('-m, --message <text>', 'Reply message')
  .option('-b, --blog-id <id>', 'Blog ID')
  .option('-j, --json', 'Output as JSON')
  .action(inboxReply);

inbox
  .command('comments')
  .description('List post comments')
  .option('-n, --network <network>', 'Filter by network')
  .option('-p, --post-id <id>', 'Filter by post ID')
  .option('-b, --blog-id <id>', 'Blog ID')
  .option('-j, --json', 'Output as JSON')
  .action(inboxComments);

inbox
  .command('comment-reply')
  .description('Reply to a comment')
  .requiredOption('-c, --comment-id <id>', 'Comment ID')
  .requiredOption('-m, --message <text>', 'Reply message')
  .option('-b, --blog-id <id>', 'Blog ID')
  .option('-j, --json', 'Output as JSON')
  .action(inboxCommentReply);

inbox
  .command('reviews')
  .description('List reviews')
  .option('-n, --network <network>', 'Filter by network')
  .option('-b, --blog-id <id>', 'Blog ID')
  .option('-j, --json', 'Output as JSON')
  .action(inboxReviews);

inbox
  .command('review-reply')
  .description('Reply to a review')
  .requiredOption('-r, --review-id <id>', 'Review ID')
  .requiredOption('-m, --message <text>', 'Reply message')
  .option('-b, --blog-id <id>', 'Blog ID')
  .option('-j, --json', 'Output as JSON')
  .action(inboxReviewReply);

// ============================================================================
// SMART LINKS COMMANDS
// ============================================================================

const smartlinks = program.command('smartlinks').description('Smart links (Link in Bio)');

smartlinks
  .command('list')
  .description('List smart links')
  .option('-b, --blog-id <id>', 'Blog ID')
  .option('-j, --json', 'Output as JSON')
  .action(smartlinksList);

smartlinks
  .command('create')
  .description('Create a smart link')
  .requiredOption('-t, --title <title>', 'Link title')
  .requiredOption('-u, --url <url>', 'Target URL')
  .option('-d, --description <desc>', 'Description')
  .option('-b, --blog-id <id>', 'Blog ID')
  .option('-j, --json', 'Output as JSON')
  .action(smartlinksCreate);

smartlinks
  .command('update')
  .description('Update a smart link')
  .requiredOption('-i, --id <id>', 'Link ID')
  .option('-t, --title <title>', 'New title')
  .option('-u, --url <url>', 'New URL')
  .option('-d, --description <desc>', 'New description')
  .option('-b, --blog-id <id>', 'Blog ID')
  .option('-j, --json', 'Output as JSON')
  .action(smartlinksUpdate);

smartlinks
  .command('delete')
  .description('Delete a smart link')
  .requiredOption('-i, --id <id>', 'Link ID')
  .option('-b, --blog-id <id>', 'Blog ID')
  .action(smartlinksDelete);

smartlinks
  .command('analytics')
  .description('Get smart link analytics')
  .requiredOption('-i, --id <id>', 'Link ID')
  .option('-s, --start <date>', 'Start date (ISO 8601)')
  .option('-e, --end <date>', 'End date (ISO 8601)')
  .option('-b, --blog-id <id>', 'Blog ID')
  .option('-j, --json', 'Output as JSON')
  .action(smartlinksAnalytics);

// ============================================================================
// AI FEATURES COMMANDS
// ============================================================================

const ai = program.command('ai').description('AI-powered features');

ai
  .command('generate')
  .description('Generate post copy with AI')
  .requiredOption('-p, --prompt <text>', 'Generation prompt')
  .option('-l, --language <lang>', 'Language')
  .option('-t, --tone <tone>', 'Tone (professional, casual, friendly, etc.)')
  .option('-n, --network <network>', 'Target network')
  .option('-b, --blog-id <id>', 'Blog ID')
  .option('-j, --json', 'Output as JSON')
  .action(aiGenerate);

ai
  .command('regenerate')
  .description('Regenerate post copy')
  .requiredOption('-p, --post-id <id>', 'Post ID')
  .option('-l, --language <lang>', 'Language')
  .option('-t, --tone <tone>', 'Tone')
  .option('-b, --blog-id <id>', 'Blog ID')
  .option('-j, --json', 'Output as JSON')
  .action(aiRegenerate);

ai
  .command('quick-action')
  .description('Apply AI quick action to text')
  .requiredOption('-t, --text <text>', 'Input text')
  .requiredOption('-a, --action <action>', 'Action (shorten, lengthen, rephrase, etc.)')
  .option('-l, --language <lang>', 'Language')
  .option('-b, --blog-id <id>', 'Blog ID')
  .option('-j, --json', 'Output as JSON')
  .action(aiQuickAction);

ai
  .command('schedule')
  .description('Schedule using natural language (e.g., "tomorrow at 3pm")')
  .requiredOption('-t, --text <text>', 'Natural language schedule text')
  .option('-z, --timezone <tz>', 'Timezone', 'America/New_York')
  .option('-b, --blog-id <id>', 'Blog ID')
  .option('-j, --json', 'Output as JSON')
  .action(aiSchedule);

ai
  .command('schedule-status')
  .description('Get AI scheduling job status')
  .requiredOption('--job-id <id>', 'Job ID')
  .option('-b, --blog-id <id>', 'Blog ID')
  .option('-j, --json', 'Output as JSON')
  .action(aiScheduleStatus);

ai
  .command('languages')
  .description('Get available AI languages')
  .option('-b, --blog-id <id>', 'Blog ID')
  .option('-j, --json', 'Output as JSON')
  .action(aiLanguages);

// ============================================================================
// LIBRARY COMMANDS
// ============================================================================

const library = program.command('library').description('Post library management');

library
  .command('list')
  .description('List library posts')
  .option('-l, --limit <limit>', 'Limit results')
  .option('-o, --offset <offset>', 'Offset')
  .option('-b, --blog-id <id>', 'Blog ID')
  .option('-j, --json', 'Output as JSON')
  .action(libraryList);

library
  .command('create')
  .description('Create a library post')
  .requiredOption('-t, --text <text>', 'Post text')
  .option('-m, --media <urls>', 'Media URLs (comma-separated)')
  .option('-b, --blog-id <id>', 'Blog ID')
  .option('-j, --json', 'Output as JSON')
  .action(libraryCreate);

library
  .command('update')
  .description('Update a library post')
  .requiredOption('-i, --id <id>', 'Post ID')
  .option('-t, --text <text>', 'New text')
  .option('-m, --media <urls>', 'Media URLs (comma-separated)')
  .option('-b, --blog-id <id>', 'Blog ID')
  .option('-j, --json', 'Output as JSON')
  .action(libraryUpdate);

library
  .command('delete')
  .description('Delete a library post')
  .requiredOption('-i, --id <id>', 'Post ID')
  .option('-b, --blog-id <id>', 'Blog ID')
  .action(libraryDelete);

// ============================================================================
// HASHTAG TRACKER COMMANDS
// ============================================================================

const hashtags = program.command('hashtags').description('Hashtag tracking');

hashtags
  .command('list')
  .description('List tracked hashtags')
  .option('-b, --blog-id <id>', 'Blog ID')
  .option('-j, --json', 'Output as JSON')
  .action(hashtagsList);

hashtags
  .command('create')
  .description('Track a new hashtag')
  .requiredOption('-h, --hashtag <tag>', 'Hashtag to track')
  .option('-b, --blog-id <id>', 'Blog ID')
  .option('-j, --json', 'Output as JSON')
  .action(hashtagsCreate);

hashtags
  .command('stats')
  .description('Get hashtag statistics')
  .option('-s, --start <date>', 'Start date (ISO 8601)')
  .option('-e, --end <date>', 'End date (ISO 8601)')
  .option('-b, --blog-id <id>', 'Blog ID')
  .option('-j, --json', 'Output as JSON')
  .action(hashtagsStats);

// ============================================================================
// REPORTS COMMANDS
// ============================================================================

const reports = program.command('reports').description('Report management');

reports
  .command('list')
  .description('List reports')
  .option('-b, --blog-id <id>', 'Blog ID')
  .option('-j, --json', 'Output as JSON')
  .action(reportsList);

reports
  .command('status')
  .description('Get report status')
  .requiredOption('-r, --report-id <id>', 'Report ID')
  .option('-b, --blog-id <id>', 'Blog ID')
  .option('-j, --json', 'Output as JSON')
  .action(reportsStatus);

reports
  .command('config')
  .description('Get or set report configuration')
  .option('--set <json>', 'Set config (JSON string)')
  .option('-b, --blog-id <id>', 'Blog ID')
  .option('-j, --json', 'Output as JSON')
  .action(reportsConfig);

// ============================================================================
// BRAND/ACCOUNT COMMANDS
// ============================================================================

const brand = program.command('brand').description('Brand/account management');

brand
  .command('info')
  .description('Get brand information')
  .option('-b, --blog-id <id>', 'Blog ID')
  .option('-j, --json', 'Output as JSON')
  .action(brandInfo);

brand
  .command('update')
  .description('Update brand information')
  .option('-n, --name <name>', 'Brand name')
  .option('-t, --timezone <tz>', 'Timezone')
  .option('-b, --blog-id <id>', 'Blog ID')
  .option('-j, --json', 'Output as JSON')
  .action(brandUpdate);

brand
  .command('connections')
  .description('Get brand network connections')
  .option('-b, --blog-id <id>', 'Blog ID')
  .option('-j, --json', 'Output as JSON')
  .action(brandConnections);

brand
  .command('images')
  .description('Get brand images')
  .option('-b, --blog-id <id>', 'Blog ID')
  .option('-j, --json', 'Output as JSON')
  .action(brandImages);

program
  .command('user')
  .description('Get user information')
  .option('-j, --json', 'Output as JSON')
  .action(userInfo);

program
  .command('subscription')
  .description('Get subscription information')
  .option('-j, --json', 'Output as JSON')
  .action(subscription);

// ============================================================================
// ADVERTISING COMMANDS
// ============================================================================

const ads = program.command('ads').description('Advertising management');

ads
  .command('campaigns')
  .description('List ad campaigns')
  .option('-b, --blog-id <id>', 'Blog ID')
  .option('-j, --json', 'Output as JSON')
  .action(adsCampaigns);

ads
  .command('groups')
  .description('List ad groups')
  .option('-c, --campaign-id <id>', 'Filter by campaign ID')
  .option('-b, --blog-id <id>', 'Blog ID')
  .option('-j, --json', 'Output as JSON')
  .action(adsGroups);

ads
  .command('list')
  .description('List ads')
  .option('-g, --ad-group-id <id>', 'Filter by ad group ID')
  .option('-b, --blog-id <id>', 'Blog ID')
  .option('-j, --json', 'Output as JSON')
  .action(adsList);

ads
  .command('keywords')
  .description('List ad keywords')
  .option('-g, --ad-group-id <id>', 'Filter by ad group ID')
  .option('-b, --blog-id <id>', 'Blog ID')
  .option('-j, --json', 'Output as JSON')
  .action(adsKeywords);

// ============================================================================
// PERFORMANCE DASHBOARDS COMMANDS
// ============================================================================

const dashboard = program.command('dashboard').description('Performance dashboards');

dashboard
  .command('list')
  .description('List dashboards')
  .option('-b, --blog-id <id>', 'Blog ID')
  .option('-j, --json', 'Output as JSON')
  .action(dashboardList);

dashboard
  .command('create')
  .description('Create a dashboard')
  .requiredOption('-n, --name <name>', 'Dashboard name')
  .option('-d, --description <desc>', 'Description')
  .option('-b, --blog-id <id>', 'Blog ID')
  .option('-j, --json', 'Output as JSON')
  .action(dashboardCreate);

dashboard
  .command('analytics')
  .description('Get dashboard analytics')
  .requiredOption('-d, --dashboard-id <id>', 'Dashboard ID')
  .option('-s, --start <date>', 'Start date (ISO 8601)')
  .option('-e, --end <date>', 'End date (ISO 8601)')
  .option('-b, --blog-id <id>', 'Blog ID')
  .option('-j, --json', 'Output as JSON')
  .action(dashboardAnalytics);

dashboard
  .command('sync')
  .description('Sync dashboard data')
  .requiredOption('-d, --dashboard-id <id>', 'Dashboard ID')
  .option('-b, --blog-id <id>', 'Blog ID')
  .option('-j, --json', 'Output as JSON')
  .action(dashboardSync);

// ============================================================================
// MEDIA COMMANDS
// ============================================================================

const media = program.command('media').description('Media management');

media
  .command('images')
  .description('List images')
  .option('-l, --limit <limit>', 'Limit results')
  .option('-o, --offset <offset>', 'Offset')
  .option('-b, --blog-id <id>', 'Blog ID')
  .option('-j, --json', 'Output as JSON')
  .action(mediaImages);

media
  .command('videos')
  .description('List videos')
  .option('-l, --limit <limit>', 'Limit results')
  .option('-o, --offset <offset>', 'Offset')
  .option('-b, --blog-id <id>', 'Blog ID')
  .option('-j, --json', 'Output as JSON')
  .action(mediaVideos);

media
  .command('upload')
  .description('Upload media file')
  .requiredOption('-u, --url <url>', 'Media URL')
  .option('-f, --filename <name>', 'Filename')
  .option('-c, --content-type <type>', 'Content type')
  .option('-b, --blog-id <id>', 'Blog ID')
  .option('-j, --json', 'Output as JSON')
  .action(uploadMedia);

media
  .command('normalize <url>')
  .description('Normalize external image URL to Metricool-hosted URL')
  .option('-b, --blog-id <id>', 'Blog ID')
  .action(normalizeImageUrl);

// ============================================================================
// CALENDARS COMMANDS
// ============================================================================

const calendar = program.command('calendar').description('Calendar management');

calendar
  .command('list')
  .description('List calendars')
  .option('-b, --blog-id <id>', 'Blog ID')
  .option('-j, --json', 'Output as JSON')
  .action(calendarList);

calendar
  .command('events')
  .description('List calendar events')
  .option('-s, --start <date>', 'Start date (ISO 8601)')
  .option('-e, --end <date>', 'End date (ISO 8601)')
  .option('-b, --blog-id <id>', 'Blog ID')
  .option('-j, --json', 'Output as JSON')
  .action(calendarEvents);

calendar
  .command('create')
  .description('Create a calendar')
  .requiredOption('-n, --name <name>', 'Calendar name')
  .option('-d, --description <desc>', 'Description')
  .option('-b, --blog-id <id>', 'Blog ID')
  .option('-j, --json', 'Output as JSON')
  .action(calendarCreate);

// ============================================================================
// MISC UTILITIES
// ============================================================================

program
  .command('gif')
  .description('Search GIFs')
  .option('-q, --query <text>', 'Search query (blank for trending)')
  .option('-o, --offset <num>', 'Offset for pagination')
  .option('-l, --limit <num>', 'Max results')
  .option('--lang <lang>', 'Language (2-letter ISO code)')
  .option('--rating <rating>', 'Rating (g, pg, pg-13, r)')
  .option('-j, --json', 'Output as JSON')
  .action(gifSearch);

program
  .command('suggestions <network>')
  .description('Get account suggestions for a network (twitter, facebook, linkedin, bluesky)')
  .requiredOption('-q, --query <text>', 'Search query')
  .option('-b, --blog-id <id>', 'Blog ID')
  .option('-j, --json', 'Output as JSON')
  .action(suggestions);

program
  .command('counters')
  .description('Get scheduler counters')
  .option('-b, --blog-id <id>', 'Blog ID')
  .option('-j, --json', 'Output as JSON')
  .action(counters);

program
  .command('ping')
  .description('Health check')
  .action(ping);

// Legacy stats command
program
  .command('stats <network>')
  .description('Get network statistics (DEPRECATED - use analytics commands)')
  .option('-b, --blog-id <id>', 'Blog ID')
  .option('-j, --json', 'Output as JSON')
  .action(getStats);

// Parse and execute
program.parse();
