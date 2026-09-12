import React, { useState } from 'react';
import { X, Copy, Check, Code, FileText, Smartphone } from 'lucide-react';

interface FlutterCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FlutterCodeModal: React.FC<FlutterCodeModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'checkin_screen' | 'firestore_service' | 'pubspec' | 'main' | 'rules'>('checkin_screen');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const flutterCheckinScreen = `// lib/screens/checkin_screen.dart
import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:record/record.dart';
import 'package:audioplayers/audioplayers.dart';
import 'package:path_provider/path_provider.dart';
import '../services/firestore_service.dart';

class CheckInScreen extends StatefulWidget {
  final String groupId;
  final String currentUid;
  final String currentDisplayName;

  const CheckInScreen({
    Key? key,
    required this.groupId,
    required this.currentUid,
    required this.currentDisplayName,
  }) : super(key: key);

  @override
  State<CheckInScreen> createState() => _CheckInScreenState();
}

class _CheckInScreenState extends State<CheckInScreen> {
  final FirestoreService _firestore = FirestoreService();
  final AudioRecorder _audioRecorder = AudioRecorder();
  final AudioPlayer _audioPlayer = AudioPlayer();

  bool _isEmergencyMode = false;
  bool _isHolding = false;
  bool _isRecording = false;
  int _recordSeconds = 0;
  Timer? _holdTimer;
  Timer? _recordTicker;
  DateTime? _pressStartTime;

  @override
  void dispose() {
    _holdTimer?.cancel();
    _recordTicker?.cancel();
    _audioRecorder.dispose();
    _audioPlayer.dispose();
    super.dispose();
  }

  void _onButtonDown() {
    _pressStartTime = DateTime.now();
    _isHolding = true;
    HapticFeedback.selectionClick();

    _holdTimer = Timer(const Duration(milliseconds: 1000), () async {
      if (_isHolding) {
        // Press & Hold (>= 1 sec): Begin audio recording
        await _startRecording();
      }
    });
  }

  void _onButtonUp() async {
    _holdTimer?.cancel();
    final durationMs = DateTime.now().difference(_pressStartTime ?? DateTime.now()).inMilliseconds;
    _isHolding = false;

    if (_isRecording) {
      // Release after recording: stop, upload to Firebase Storage, save checkin
      await _stopRecordingAndSubmit();
    } else if (durationMs < 1000) {
      // Quick Tap (< 1 sec)
      if (!_isEmergencyMode) {
        // Blue Quick Tap: Immediate CHECKED_IN
        HapticFeedback.mediumImpact();
        await _firestore.checkIn(
          groupId: widget.groupId,
          userId: widget.currentUid,
          userName: widget.currentDisplayName,
          type: 'AOKAY',
        );
        _showSnackBar("You're Checked In! ✓", Colors.green);
      } else {
        // Red Quick Tap: Immediate Silent Emergency
        HapticFeedback.heavyImpact();
        await _firestore.checkIn(
          groupId: widget.groupId,
          userId: widget.currentUid,
          userName: widget.currentDisplayName,
          type: 'NOT_OKAY',
          emergencyNote: '🚨 Silent emergency alert sent',
        );
        _showSnackBar("Emergency Alert Sent! ⚠️", Colors.red);
      }
    }
  }

  Future<void> _startRecording() async {
    if (await _audioRecorder.hasPermission()) {
      final dir = await getTemporaryDirectory();
      final path = '\${dir.path}/checkin_\${DateTime.now().millisecondsSinceEpoch}.m4a';

      await _audioRecorder.start(
        const RecordConfig(encoder: AudioEncoder.aacLc),
        path: path,
      );

      HapticFeedback.vibrate();
      setState(() {
        _isRecording = true;
        _recordSeconds = 0;
      });

      _recordTicker = Timer.periodic(const Duration(seconds: 1), (t) {
        setState(() => _recordSeconds++);
      });
    }
  }

  Future<void> _stopRecordingAndSubmit() async {
    _recordTicker?.cancel();
    final path = await _audioRecorder.stop();
    setState(() => _isRecording = false);

    if (path != null) {
      HapticFeedback.heavyImpact();
      // Upload path to Firebase Storage: /groups/{groupId}/audio/{id}.m4a
      final audioUrl = await _firestore.uploadAudio(widget.groupId, path);

      await _firestore.checkIn(
        groupId: widget.groupId,
        userId: widget.currentUid,
        userName: widget.currentDisplayName,
        type: _isEmergencyMode ? 'NOT_OKAY' : 'AOKAY',
        audioUrl: audioUrl,
        audioDurationSec: _recordSeconds,
        emergencyNote: _isEmergencyMode ? 'Voice emergency message' : null,
      );

      _showSnackBar(
        _isEmergencyMode ? "Emergency voice alert sent!" : "Voice check-in shared! 🎙️",
        _isEmergencyMode ? Colors.red : Colors.blue,
      );
    }
  }

  void _showSnackBar(String msg, Color bg) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(msg, style: const TextStyle(fontWeight: FontWeight.bold)), backgroundColor: bg),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0F172A),
      appBar: AppBar(
        backgroundColor: const Color(0xFF1E293B),
        elevation: 0,
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('The Miller Family', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
            Text('PIN: 4829', style: TextStyle(color: Colors.blue.shade300, fontSize: 12, fontFamily: 'monospace')),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.settings),
            onPressed: () {},
          ),
        ],
      ),
      body: SafeArea(
        child: Column(
          children: [
            // 1. Family Status Feed (StreamBuilder)
            Expanded(
              child: StreamBuilder<List<MemberModel>>(
                stream: _firestore.streamMembers(widget.groupId),
                builder: (context, snapshot) {
                  if (!snapshot.hasData) return const Center(child: CircularProgressIndicator());
                  final members = snapshot.data!;
                  return ListView.separated(
                    padding: const EdgeInsets.all(16),
                    itemCount: members.length,
                    separatorBuilder: (_, __) => const SizedBox(height: 12),
                    itemBuilder: (context, i) {
                      final m = members[i];
                      return _buildMemberCard(m);
                    },
                  );
                },
              ),
            ),

            // 2. Swipe Up Gesture Indicator
            if (!_isEmergencyMode)
              GestureDetector(
                onVerticalDragUpdate: (details) {
                  if (details.delta.dy < -6) {
                    setState(() => _isEmergencyMode = true);
                    HapticFeedback.heavyImpact();
                  }
                },
                child: Padding(
                  padding: const EdgeInsets.symmetric(vertical: 8),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: const [
                      Icon(Icons.keyboard_arrow_up, color: Colors.redAccent, size: 20),
                      SizedBox(width: 4),
                      Text("SWIPE UP FOR NOT OKAY", style: TextStyle(color: Colors.redAccent, fontSize: 11, fontWeight: FontWeight.bold)),
                      SizedBox(width: 4),
                      Icon(Icons.keyboard_arrow_up, color: Colors.redAccent, size: 20),
                    ],
                  ),
                ),
              )
            else
              TextButton.icon(
                onPressed: () => setState(() => _isEmergencyMode = false),
                icon: const Icon(Icons.close, color: Colors.white70, size: 18),
                label: const Text("CANCEL EMERGENCY MODE", style: TextStyle(color: Colors.white70, fontWeight: FontWeight.bold)),
              ),

            // 3. Hero Gesture Action Button
            GestureDetector(
              onPanUpdate: (details) {
                if (!_isEmergencyMode && details.delta.dy < -10) {
                  setState(() => _isEmergencyMode = true);
                  HapticFeedback.heavyImpact();
                }
              },
              onTapDown: (_) => _onButtonDown(),
              onTapUp: (_) => _onButtonUp(),
              onTapCancel: () {
                _holdTimer?.cancel();
                _isHolding = false;
              },
              child: Container(
                margin: const EdgeInsets.only(bottom: 24),
                width: 170,
                height: 170,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: _isEmergencyMode ? const Color(0xFFDC2626) : const Color(0xFF2563EB),
                  boxShadow: [
                    BoxShadow(
                      color: (_isEmergencyMode ? Colors.red : Colors.blue).withOpacity(0.5),
                      blurRadius: 28,
                      spreadRadius: 4,
                    )
                  ],
                  border: Border.all(
                    color: _isEmergencyMode ? Colors.red.shade300 : Colors.blue.shade300,
                    width: 4,
                  ),
                ),
                child: Center(
                  child: _isRecording
                      ? Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            const Icon(Icons.mic, color: Colors.white, size: 40),
                            const SizedBox(height: 4),
                            Text("0:\${_recordSeconds.toString().padLeft(2, '0')}", style: const TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold)),
                            const Text("Release to Send", style: TextStyle(color: Colors.white70, fontSize: 10)),
                          ],
                        )
                      : Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(_isEmergencyMode ? Icons.warning_amber_rounded : Icons.check_circle_outline, color: Colors.white, size: 40),
                            const SizedBox(height: 6),
                            Text(
                              _isEmergencyMode ? "NOT OKAY" : "I'm Aokay",
                              style: const TextStyle(color: Colors.white, fontSize: 22, fontWeight: FontWeight.w900),
                            ),
                            Text(
                              _isEmergencyMode ? "Tap: Silent | Hold: Voice" : "Tap: Check In | Hold: Voice",
                              style: const TextStyle(color: Colors.white70, fontSize: 9, fontWeight: FontWeight.w600),
                            ),
                          ],
                        ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildMemberCard(MemberModel member) {
    final isCheckedIn = member.status == 'CHECKED_IN';
    final isNotOkay = member.status == 'NOT_OKAY';

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: isNotOkay ? const Color(0xFF450A0A) : const Color(0xFF1E293B),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: isNotOkay ? Colors.red : (isCheckedIn ? Colors.teal.shade700 : Colors.amber.shade700),
        ),
      ),
      child: Row(
        children: [
          CircleAvatar(
            backgroundColor: isNotOkay ? Colors.red : (isCheckedIn ? Colors.green : Colors.amber),
            child: Text(member.displayName[0], style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(member.displayName, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16)),
                Text(member.role == 'SENIOR' ? 'Senior' : 'Caregiver', style: const TextStyle(color: Colors.white54, fontSize: 12)),
              ],
            ),
          ),
          if (member.status == 'PENDING')
            ElevatedButton.icon(
              onPressed: () => _firestore.sendPingNudge(widget.groupId, member.uid),
              icon: const Icon(Icons.notifications_active, size: 16),
              label: const Text('Ping'),
              style: ElevatedButton.styleFrom(backgroundColor: Colors.amber.shade600, foregroundColor: Colors.black),
            )
          else
            Chip(
              backgroundColor: isCheckedIn ? Colors.green.shade900 : Colors.red.shade900,
              label: Text(
                isCheckedIn ? 'Checked In ✓' : 'NOT OKAY ⚠️',
                style: TextStyle(color: isCheckedIn ? Colors.greenAccent : Colors.redAccent, fontWeight: FontWeight.bold, fontSize: 12),
              ),
            ),
        ],
      ),
    );
  }
}`;

  const firestoreServiceCode = `// lib/services/firestore_service.dart
import 'dart:io';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_storage/firebase_storage.dart';

class MemberModel {
  final String uid;
  final String displayName;
  final String role; // 'SENIOR' | 'CAREGIVER'
  final String status; // 'CHECKED_IN' | 'PENDING' | 'NOT_OKAY'
  final DateTime lastCheckInAt;
  final String? pushToken;

  MemberModel({
    required this.uid,
    required this.displayName,
    required this.role,
    required this.status,
    required this.lastCheckInAt,
    this.pushToken,
  });

  factory MemberModel.fromFirestore(Map<String, dynamic> data, String uid) {
    return MemberModel(
      uid: uid,
      displayName: data['displayName'] ?? 'Member',
      role: data['role'] ?? 'SENIOR',
      status: data['status'] ?? 'PENDING',
      lastCheckInAt: (data['lastCheckInAt'] as Timestamp?)?.toDate() ?? DateTime.now(),
      pushToken: data['pushToken'],
    );
  }
}

class FirestoreService {
  final FirebaseFirestore _db = FirebaseFirestore.instance;
  final FirebaseStorage _storage = FirebaseStorage.instance;

  Stream<List<MemberModel>> streamMembers(String groupId) {
    return _db
        .collection('groups')
        .doc(groupId)
        .collection('members')
        .snapshots()
        .map((snapshot) => snapshot.docs
            .map((doc) => MemberModel.fromFirestore(doc.data(), doc.id))
            .toList());
  }

  Future<void> checkIn({
    required String groupId,
    required String userId,
    required String userName,
    required String type, // 'AOKAY' | 'NOT_OKAY'
    String? audioUrl,
    int? audioDurationSec,
    String? emergencyNote,
  }) async {
    final now = FieldValue.serverTimestamp();

    // 1. Update member document
    await _db
        .collection('groups')
        .doc(groupId)
        .collection('members')
        .doc(userId)
        .update({
      'status': type == 'AOKAY' ? 'CHECKED_IN' : 'NOT_OKAY',
      'lastCheckInAt': now,
    });

    // 2. Add checkin record
    await _db
        .collection('groups')
        .doc(groupId)
        .collection('checkins')
        .add({
      'authorUid': userId,
      'authorName': userName,
      'type': type,
      'timestamp': now,
      'audioUrl': audioUrl,
      'audioDurationSec': audioDurationSec,
      'isSaved': false,
      'emergencyNote': emergencyNote,
    });
  }

  Future<String> uploadAudio(String groupId, String localFilePath) async {
    final file = File(localFilePath);
    final id = DateTime.now().millisecondsSinceEpoch;
    final ref = _storage.ref().child('groups/$groupId/audio/$id.m4a');
    final uploadTask = await ref.putFile(file);
    return await uploadTask.ref.getDownloadURL();
  }

  Future<void> sendPingNudge(String groupId, String targetUserId) async {
    // Write a nudge notification trigger in Firestore / Cloud Functions
    await _db.collection('groups').doc(groupId).collection('nudges').add({
      'targetUserId': targetUserId,
      'timestamp': FieldValue.serverTimestamp(),
    });
  }
}`;

  const pubspecYaml = `name: aokay
description: Family Safety & Senior Check-In App
publish_to: 'none'
version: 1.0.0+1

environment:
  sdk: '>=3.0.0 <4.0.0'

dependencies:
  flutter:
    sdk: flutter
  firebase_core: ^3.6.0
  cloud_firestore: ^5.4.4
  firebase_auth: ^5.3.1
  firebase_storage: ^12.3.4
  firebase_messaging: ^15.1.3
  record: ^5.1.2
  audioplayers: ^6.0.0
  path_provider: ^2.1.4
  provider: ^6.1.2

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^4.0.0

flutter:
  uses-material-design: true`;

  const firestoreRulesCode = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isGroupMember(groupId) {
      return request.auth != null && 
        exists(/databases/$(database)/documents/groups/$(groupId)/members/$(request.auth.uid));
    }
    match /groups/{groupId} {
      allow read, write: if isGroupMember(groupId);
      match /{allSubcollections=**} {
        allow read, write: if isGroupMember(groupId);
      }
    }
  }
}`;

  const mainDartCode = `// lib/main.dart
import 'package:flutter/material.dart';
import 'package:firebase_core/firebase_core.dart';
import 'screens/checkin_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp();
  runApp(const AokayApp());
}

class AokayApp extends StatelessWidget {
  const AokayApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Aokay',
      debugShowCheckedModeBanner: false,
      theme: ThemeData.dark().copyWith(
        scaffoldBackgroundColor: const Color(0xFF0F172A),
        primaryColor: const Color(0xFF2563EB),
        colorScheme: const ColorScheme.dark(
          primary: Color(0xFF2563EB),
          secondary: Color(0xFF10B981),
          error: Color(0xFFEF4444),
        ),
      ),
      home: const CheckInScreen(
        groupId: 'OK-4829',
        currentUid: 'senior-mom',
        currentDisplayName: 'Mom',
      ),
    );
  }
}`;

  const getCode = () => {
    switch (activeTab) {
      case 'checkin_screen':
        return flutterCheckinScreen;
      case 'firestore_service':
        return firestoreServiceCode;
      case 'pubspec':
        return pubspecYaml;
      case 'main':
        return mainDartCode;
      case 'rules':
        return firestoreRulesCode;
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(getCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
      <div className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-blue-400" />
            <div>
              <h2 className="text-base font-bold text-white">Flutter & Firebase Source Code</h2>
              <p className="text-xs text-slate-400">
                Ready-to-run Dart architecture for Android & iOS releases
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={copyCode}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied' : 'Copy File'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-4 py-2 bg-slate-950/60 border-b border-slate-800 overflow-x-auto text-xs font-mono">
          <button
            onClick={() => setActiveTab('checkin_screen')}
            className={`px-3 py-1.5 rounded-md font-semibold transition ${
              activeTab === 'checkin_screen' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            checkin_screen.dart
          </button>
          <button
            onClick={() => setActiveTab('firestore_service')}
            className={`px-3 py-1.5 rounded-md font-semibold transition ${
              activeTab === 'firestore_service' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            firestore_service.dart
          </button>
          <button
            onClick={() => setActiveTab('pubspec')}
            className={`px-3 py-1.5 rounded-md font-semibold transition ${
              activeTab === 'pubspec' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            pubspec.yaml
          </button>
          <button
            onClick={() => setActiveTab('main')}
            className={`px-3 py-1.5 rounded-md font-semibold transition ${
              activeTab === 'main' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            main.dart
          </button>
          <button
            onClick={() => setActiveTab('rules')}
            className={`px-3 py-1.5 rounded-md font-semibold transition ${
              activeTab === 'rules' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            firestore.rules
          </button>
        </div>

        {/* Code View Area */}
        <div className="flex-1 p-4 overflow-auto bg-slate-950/90 font-mono text-xs text-slate-300 leading-relaxed">
          <pre>{getCode()}</pre>
        </div>
      </div>
    </div>
  );
};
