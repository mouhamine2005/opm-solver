"""
Service de simulation de Machine de Turing
Supporte: machines mono/multi-rubans, détection de boucles infinies, exécution step-by-step
Auteur: OPM Solver Pro
Année: 2024
"""

from typing import Dict, List, Tuple, Optional, Any, Set
import time
from dataclasses import dataclass


@dataclass
class TapeState:
    """État d'un ruban à un moment donné"""
    content: List[str]
    head_position: int
    
    def get_symbol(self) -> str:
        """Lire le symbole sous la tête"""
        if 0 <= self.head_position < len(self.content):
            return self.content[self.head_position]
        return '_'  # Symbole blanc par défaut
    
    def write_symbol(self, symbol: str):
        """Écrire un symbole sous la tête"""
        if self.head_position < 0:
            # Étendre à gauche
            self.content.insert(0, symbol)
            self.head_position = 0
        elif self.head_position >= len(self.content):
            # Étendre à droite
            self.content.extend(['_'] * (self.head_position - len(self.content) + 1))
            self.content[self.head_position] = symbol
        else:
            self.content[self.head_position] = symbol
    
    def move_head(self, direction: str):
        """Déplacer la tête"""
        if direction == 'L':
            self.head_position -= 1
        elif direction == 'R':
            self.head_position += 1
        # 'N' = pas de mouvement
    
    def to_string(self, blank: str = '_') -> str:
        """Convertir le ruban en chaîne"""
        # Trim les blancs aux extrémités
        content = self.content.copy()
        while content and content[0] == blank:
            content.pop(0)
            self.head_position -= 1
        while content and content[-1] == blank:
            content.pop()
        
        if not content:
            return blank
        
        return ''.join(content)


class TuringMachine:
    """
    Simulateur de Machine de Turing avancé
    
    Fonctionnalités:
    - Support mono-ruban et multi-rubans
    - Détection de boucles infinies (configuration répétée)
    - Exécution step-by-step avec historique complet
    - Gestion automatique de l'extension des rubans
    """
    
    def __init__(
        self,
        tapes: List[str],
        blank_symbol: str = "_",
        initial_state: str = "q0",
        final_states: List[str] = None,
        transitions: List[Dict[str, Any]] = None,
        head_positions: List[int] = None,
        detect_loops: bool = True,
        max_tape_size: int = 10000
    ):
        """
        Initialiser la machine de Turing
        
        Args:
            tapes: Liste des contenus initiaux des rubans
            blank_symbol: Symbole blanc
            initial_state: État initial
            final_states: Liste des états acceptants
            transitions: Liste des règles de transition
            head_positions: Positions initiales des têtes (une par ruban)
            detect_loops: Activer la détection de boucles infinies
            max_tape_size: Taille maximale d'un ruban (sécurité)
        """
        # Configuration de base
        self.num_tapes = len(tapes)
        self.blank = blank_symbol
        self.initial_state = initial_state
        self.state = initial_state
        self.final_states = final_states or []
        self.detect_loops = detect_loops
        self.max_tape_size = max_tape_size
        
        # Initialiser les rubans
        self.tapes = [
            TapeState(list(tape), pos if head_positions else 0)
            for tape, pos in zip(tapes, head_positions or [0] * len(tapes))
        ]
        
        # Construire la table de transitions
        # Format: (state, symbols...) -> (new_state, write_symbols..., directions...)
        self.transitions: Dict[Tuple, Tuple] = {}
        for trans in (transitions or []):
            # Clé: (état_actuel, symbole_ruban1, symbole_ruban2, ...)
            key_parts = [trans['current_state']]
            
            if self.num_tapes == 1:
                # Mono-ruban: symbole unique
                key_parts.append(trans['read_symbol'])
            else:
                # Multi-rubans: liste de symboles
                key_parts.extend(trans['read_symbols'])
            
            key = tuple(key_parts)
            
            # Valeur: (nouvel_état, symboles_à_écrire, directions)
            if self.num_tapes == 1:
                value = (
                    trans['next_state'],
                    trans['write_symbol'],
                    trans['move_direction']
                )
            else:
                value = (
                    trans['next_state'],
                    tuple(trans['write_symbols']),
                    tuple(trans['move_directions'])
                )
            
            self.transitions[key] = value
        
        # Historique et détection de boucles
        self.steps: List[Dict[str, Any]] = []
        self.configurations: Set[str] = set()
        self.loop_detected = False
        self.halted = False
        self.halt_reason = None
    
    def get_configuration_hash(self) -> str:
        """
        Obtenir un hash de la configuration actuelle
        Utilisé pour détecter les boucles infinies
        """
        tape_strings = [tape.to_string(self.blank) for tape in self.tapes]
        head_positions = [tape.head_position for tape in self.tapes]
        
        config = f"{self.state}|{'|'.join(tape_strings)}|{','.join(map(str, head_positions))}"
        return config
    
    def check_tape_size_limit(self) -> bool:
        """Vérifier si un ruban dépasse la taille maximale"""
        for tape in self.tapes:
            if len(tape.content) > self.max_tape_size:
                return True
        return False
    
    def step(self) -> Tuple[bool, Optional[str]]:
        """
        Exécuter une étape de la machine de Turing
        
        Returns:
            (can_continue, message): Peut continuer?, message de statut
        """
        # Vérification de sécurité
        if self.check_tape_size_limit():
            self.halted = True
            self.halt_reason = f"Tape size limit exceeded ({self.max_tape_size})"
            return False, self.halt_reason
        
        # Lire les symboles actuels
        current_symbols = [tape.get_symbol() for tape in self.tapes]
        
        # Enregistrer l'état avant transition
        step_info = {
            'step_number': len(self.steps),
            'current_state': self.state,
            'tape_contents': [tape.to_string(self.blank) for tape in self.tapes],
            'head_positions': [tape.head_position for tape in self.tapes],
            'symbols_read': current_symbols,
            'action_taken': None
        }
        
        # Vérifier si on est dans un état final
        if self.state in self.final_states:
            step_info['action_taken'] = f"✓ Accepté dans l'état {self.state}"
            self.steps.append(step_info)
            self.halted = True
            self.halt_reason = "Accepted"
            return False, "Accepted"
        
        # Détecter les boucles infinies
        if self.detect_loops:
            config_hash = self.get_configuration_hash()
            if config_hash in self.configurations:
                step_info['action_taken'] = "⚠ Boucle infinie détectée (configuration répétée)"
                self.steps.append(step_info)
                self.loop_detected = True
                self.halted = True
                self.halt_reason = "Infinite loop detected"
                return False, "Infinite loop detected"
            self.configurations.add(config_hash)
        
        # Chercher la transition applicable
        if self.num_tapes == 1:
            key = (self.state, current_symbols[0])
        else:
            key = tuple([self.state] + current_symbols)
        
        if key not in self.transitions:
            step_info['action_taken'] = f"✗ Aucune transition pour ({self.state}, {current_symbols})"
            self.steps.append(step_info)
            self.halted = True
            self.halt_reason = "No transition"
            return False, "Rejected (no transition)"
        
        # Récupérer et exécuter la transition
        if self.num_tapes == 1:
            next_state, write_symbol, direction = self.transitions[key]
            
            # Écrire et déplacer
            self.tapes[0].write_symbol(write_symbol)
            self.tapes[0].move_head(direction)
            
            action = f"Écrire '{write_symbol}', mouvement {direction}, état → {next_state}"
        else:
            next_state, write_symbols, directions = self.transitions[key]
            
            # Écrire et déplacer sur chaque ruban
            for tape, symbol, direction in zip(self.tapes, write_symbols, directions):
                tape.write_symbol(symbol)
                tape.move_head(direction)
            
            writes = ', '.join(f"R{i}:'{s}'" for i, s in enumerate(write_symbols))
            moves = ', '.join(f"R{i}:{d}" for i, d in enumerate(directions))
            action = f"Écrire [{writes}], mouvements [{moves}], état → {next_state}"
        
        # Changer d'état
        self.state = next_state
        step_info['action_taken'] = action
        self.steps.append(step_info)
        
        return True, None
    
    def run(self, max_steps: int = 1000) -> Dict[str, Any]:
        """
        Exécuter la machine jusqu'à l'arrêt ou max_steps
        
        Returns:
            Dictionnaire avec les résultats de l'exécution
        """
        start_time = time.time()
        
        for step_count in range(max_steps):
            can_continue, message = self.step()
            if not can_continue:
                break
        else:
            # Atteint max_steps sans s'arrêter
            self.halted = True
            self.halt_reason = f"Max steps limit ({max_steps})"
            message = f"Exécution arrêtée après {max_steps} étapes (limite)"
        
        execution_time = time.time() - start_time
        
        # Déterminer si accepté
        accepted = self.state in self.final_states
        
        # Résultats finaux des rubans
        final_tapes = [tape.to_string(self.blank) for tape in self.tapes]
        
        return {
            'success': True,
            'accepted': accepted,
            'final_tapes': final_tapes,
            'final_state': self.state,
            'execution_steps': self.steps,
            'total_steps': len(self.steps),
            'halted': self.halted,
            'halt_reason': self.halt_reason,
            'loop_detected': self.loop_detected,
            'execution_time': execution_time,
            'message': message or (
                f"✓ Accepté dans l'état {self.state}" if accepted 
                else f"✗ Rejeté dans l'état {self.state}"
            ),
            'num_tapes': self.num_tapes
        }
    
    def run_with_animation_data(self, max_steps: int = 1000) -> Dict[str, Any]:
        """
        Exécuter et retourner des données optimisées pour l'animation
        """
        result = self.run(max_steps)
        
        # Ajouter des métadonnées pour l'animation
        result['animation_frames'] = [
            {
                'step': step['step_number'],
                'state': step['current_state'],
                'tapes': step['tape_contents'],
                'heads': step['head_positions'],
                'action': step['action_taken']
            }
            for step in self.steps
        ]
        
        return result


def create_example_machines() -> Dict[str, Dict[str, Any]]:
    """
    Créer une bibliothèque de machines de Turing classiques
    """
    examples = {
        'palindrome': {
            'name': 'Vérificateur de palindromes binaires',
            'description': 'Vérifie si une chaîne binaire est un palindrome',
            'initial_tape': '1011101',
            'initial_state': 'q0',
            'final_states': ['q_accept'],
            'transitions': [
                # Logique de palindrome simplifié
                {'current_state': 'q0', 'read_symbol': '0', 'next_state': 'q1', 'write_symbol': 'X', 'move_direction': 'R'},
                {'current_state': 'q0', 'read_symbol': '1', 'next_state': 'q5', 'write_symbol': 'X', 'move_direction': 'R'},
                {'current_state': 'q0', 'read_symbol': 'X', 'next_state': 'q_accept', 'write_symbol': 'X', 'move_direction': 'N'},
            ],
            'num_tapes': 1
        },
        
        'binary_increment': {
            'name': 'Incrémentation binaire',
            'description': 'Ajoute 1 à un nombre binaire',
            'initial_tape': '1011',
            'initial_state': 'q0',
            'final_states': ['q_halt'],
            'transitions': [
                {'current_state': 'q0', 'read_symbol': '0', 'next_state': 'q0', 'write_symbol': '0', 'move_direction': 'R'},
                {'current_state': 'q0', 'read_symbol': '1', 'next_state': 'q0', 'write_symbol': '1', 'move_direction': 'R'},
                {'current_state': 'q0', 'read_symbol': '_', 'next_state': 'q1', 'write_symbol': '_', 'move_direction': 'L'},
                {'current_state': 'q1', 'read_symbol': '0', 'next_state': 'q_halt', 'write_symbol': '1', 'move_direction': 'N'},
                {'current_state': 'q1', 'read_symbol': '1', 'next_state': 'q1', 'write_symbol': '0', 'move_direction': 'L'},
                {'current_state': 'q1', 'read_symbol': '_', 'next_state': 'q_halt', 'write_symbol': '1', 'move_direction': 'N'},
            ],
            'num_tapes': 1
        },
        
        'string_copy': {
            'name': 'Copie de chaîne (2 rubans)',
            'description': 'Copie le contenu du ruban 1 vers le ruban 2',
            'initial_tapes': ['abc', ''],
            'initial_state': 'q0',
            'final_states': ['q_accept'],
            'transitions': [
                {'current_state': 'q0', 'read_symbols': ['a', '_'], 'next_state': 'q0', 'write_symbols': ['a', 'a'], 'move_directions': ['R', 'R']},
                {'current_state': 'q0', 'read_symbols': ['b', '_'], 'next_state': 'q0', 'write_symbols': ['b', 'b'], 'move_directions': ['R', 'R']},
                {'current_state': 'q0', 'read_symbols': ['c', '_'], 'next_state': 'q0', 'write_symbols': ['c', 'c'], 'move_directions': ['R', 'R']},
                {'current_state': 'q0', 'read_symbols': ['_', '_'], 'next_state': 'q_accept', 'write_symbols': ['_', '_'], 'move_directions': ['N', 'N']},
            ],
            'num_tapes': 2
        },
        
        'unary_addition': {
            'name': 'Addition unaire',
            'description': 'Additionne deux nombres en notation unaire (1+11=111)',
            'initial_tape': '1+11',
            'initial_state': 'q0',
            'final_states': ['q_halt'],
            'transitions': [
                {'current_state': 'q0', 'read_symbol': '1', 'next_state': 'q0', 'write_symbol': '1', 'move_direction': 'R'},
                {'current_state': 'q0', 'read_symbol': '+', 'next_state': 'q1', 'write_symbol': '1', 'move_direction': 'R'},
                {'current_state': 'q1', 'read_symbol': '1', 'next_state': 'q1', 'write_symbol': '1', 'move_direction': 'R'},
                {'current_state': 'q1', 'read_symbol': '_', 'next_state': 'q_halt', 'write_symbol': '_', 'move_direction': 'N'},
            ],
            'num_tapes': 1
        }
    }
    
    return examples
